import { default as axios } from "axios";
import { spawnSync } from "child_process";
import { resolve, join } from "path";

const BASEPATH = resolve(import.meta.dirname, "..");

console.log("[PACKAGER] decompile: start")

spawnSync(
    "java",
    [
        "-jar",
        join(BASEPATH, "apktool.jar"),
        "d",
        join(BASEPATH, "demo.apk"),
        "-f"
    ],
    {
        stdio: "inherit",
        cwd: BASEPATH
    }
)

console.log("[PACKAGER] decompile: done")


console.log("[PACKAGER] work: start")

const {workid, workname} = await prompts([
    {
        type: 'text',
        name: 'workid',
        message: '请输入作品 ID',
        initial: '',
    },
    {
        type: 'text',
        name: 'workname',
        message: '请输入APP名称',
        initial: '',
    }
]);

const data = await axios.get(`https://api-creation.codemao.cn/coconut/web/work/${230315652}/load?channel=0`)
const bcmc_url = data.data.data.bcmc_url;

console.log("[PACKAGER] work: geturl", bcmc_url)
const bcmc = await axios.get(bcmc_url)
console.log("[PACKAGER] work: getbcmc ok")

import { readFileSync, writeFileSync, existsSync } from 'fs';
import prompts from "prompts";
let entrypoint_content = readFileSync(join(BASEPATH, "demo", "assets", "www", "entrypoint.js"), "utf-8");
entrypoint_content = entrypoint_content.replace("{replace:'me'}", JSON.stringify(bcmc.data))
writeFileSync(join(BASEPATH, "demo", "assets", "www", "entrypoint.js"), entrypoint_content, "utf-8");
console.log("[PACKAGER] work: write entrypoint.js ok")

let xml_content = readFileSync(join(BASEPATH, "demo", "AndroidManifest.xml"), "utf-8");
xml_content = xml_content.replaceAll('{WORKID}', workid);
writeFileSync(join(BASEPATH, "demo", "AndroidManifest.xml"), xml_content, "utf-8");
console.log("[PACKAGER] work: write AndroidManifest.xml ok")

let strings_content = readFileSync(join(BASEPATH, "demo", "res", "values", "strings.xml"), "utf-8");
strings_content = strings_content.replaceAll('{APPNAME}', workname);
writeFileSync(join(BASEPATH, "demo", "res", "values", "strings.xml"), strings_content, "utf-8");
console.log("[PACKAGER] work: write strings.xml ok")

const splash_pathes = ['drawable-hdpi', 'drawable-mdpi', 'drawable-xhdpi', 'drawable-xxhdpi', 'drawable-xxxhdpi'];
for (const path of splash_pathes) {
    const splash_dest = join(BASEPATH, "demo", "res", path, "screen.png");
    writeFileSync(splash_dest, readFileSync(join(BASEPATH, "splash.png")));
    console.log(`[PACKAGER] work: write ${splash_dest} ok`)
}

writeFileSync(join(BASEPATH, "demo", "res", "mipmap-mdpi", "ic_launcher.png"), readFileSync(join(BASEPATH, "icon.png")));
console.log("[PACKAGER] work: write mipmap-mdpi/ic_launcher.png ok")

console.log("[PACKAGER] work: done")

console.log("[PACKAGER] build: start")
spawnSync(
    "java",
    [
        "-jar",
        join(BASEPATH, "apktool.jar"),
        "b",
        join(BASEPATH, "demo"),
        "-o",
        join(BASEPATH, "release.apk"),
    ],
    {
        stdio: "inherit",
        cwd: BASEPATH
    }
)
console.log("[PACKAGER] build: done")

console.log("[PACKAGER] sign: start")
if (!existsSync(join(BASEPATH, "key.jks"))) {
    console.log("[PACKAGER] sign: key.jks not found, run keytool")
    spawnSync(
        "keytool",
        [
            "-genkey",
            "-keystore",
            join(BASEPATH, "key.jks"),
            "-alias",
            "demo",
            "-keyalg",
            "RSA",
        ],
        {
            stdio: "inherit",
            cwd: BASEPATH
        }
    )
    console.log("[PACKAGER] sign: key.jks ok")
}

const { pass } = await prompts({
    type: 'password',
    name: 'pass',
    message: '输入你刚刚设置的 keystore 密码',
})

spawnSync(
    "java",
    [
        "-jar",
        join(BASEPATH, "apksigner.jar"),
        "sign",
        "--ks",
        join(BASEPATH, "key.jks"),
        "--ks-key-alias",
        "demo",
        "--ks-pass",
        "pass:" + pass,
        "--key-pass",
        "pass:" + pass,
        "--out",
        join(BASEPATH, "release_signed.apk"),
        join(BASEPATH, "release.apk"),
    ],
    {
        stdio: "inherit",
        cwd: BASEPATH
    }
)

console.log("[PACKAGER] sign: done")