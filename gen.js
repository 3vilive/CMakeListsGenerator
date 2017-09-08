const walk = require('walk');
const fs = require('fs');
const path = require('path');

if (process.argv.length !== 3) {
    console.log('Usage: node gen.js <target dir>');
    process.exit(0)
}

let targetDir = process.argv[2];
targetDir = path.resolve(targetDir);
let targetDirStat = fs.statSync(targetDir);

if (!targetDirStat.isDirectory()) {
    console.error(`gen.js error: invalided target dir ${targetDir}`);
    process.exit(-1)
}

let files = [];
let walker = walk.walk(targetDir, { followLinks: false});

walker.on('file', (root, fileStat, next) => {
    let curFileName = path.resolve(root, fileStat.name);

    if (curFileName.indexOf('cmake-build-debug') !== -1) {
        return next()
    }

    if (['.c', '.h', '.cpp', '.hpp'].some(suffix => { return curFileName.endsWith(suffix) })) {
        files.push(curFileName);
    }
    next()
});

walker.on('end', () => {
    console.log('find following files:');

    files = files.map((file) => {
        return file.replace(targetDir + path.sep, '') // make absolute path
                   .replace(/\\/gi, '/')              // replace invalided sep in windows
    });

    for (let file of files) {
        console.log(file)
    }

    let sourceFiles = files.join(' ');
    let setSourceFilesStatement = `set(SOURCE_FILES ${sourceFiles})`;

    let template = fs.readFileSync(
        path.resolve('CMakeListsTemplate.txt'),
        { encoding: 'utf8', flag: 'r'}
    ).toString();

    let result = template.replace('SET_SOURCE_FILES_MARK', setSourceFilesStatement);
    let targetCMakeFilePath = path.resolve(targetDir, 'CMakeLists.txt');

    fs.writeFileSync(targetCMakeFilePath, result, { encoding: 'utf8' });
    console.log(`create ${targetCMakeFilePath} success`)
});
