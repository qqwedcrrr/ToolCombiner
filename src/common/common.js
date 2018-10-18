import XLSX from 'xlsx';

export function fileReader(f) {
    let wb;
    let rABS = true;
    return new Promise((res, rej) => {
        let reader = new FileReader();
        reader.onload = e => {
            let data = e.target.result;
            if (rABS) {
                wb = XLSX.read(btoa(dateFixer(data)), {
                    type: 'base64'
                });
            } else {
                wb = XLSX.read(data, {
                    type: 'binary'
                });
            }
            let mainlist = onstarCheckSheet(wb.Sheets)
            let proofList = XLSX.utils.sheet_to_json(mainlist, { header: 1, raw: false });
            res(proofList)
        }
        if (rABS) {
            reader.readAsArrayBuffer(f);
        } else {
            reader.readAsBinaryString(f);
            console.warn('err')
        }
    })
}

export function onstarCheckSheet(sheet) {
    for (let prop in sheet) {
        if (prop.toLowerCase().indexOf('proof_seed') > -1)
            return sheet[prop]
    }
}

export function dateFixer(data) {
    let o = "",
        l = 0,
        w = 10240;
    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}

export function handleData(value) {
    let data = value.replace(/#|(><)/g, '')
    data = data.replace(/\#/g, "")
        .replace(/\t/g, ',')
        .replace(/(^\s*)|(\s*$)/g, "")
        .split('\n')
    return data
}

export function infoFixer(list, iproofFlag, eproofFlag) {
    lengthFixer(list, iproofFlag);
    lengthFixer(list, eproofFlag);
    for (var i = 0; i < eproofFlag[eproofFlag.length - 1] + 1; i++) {
        for (var j = 0; j < list[i].length; j++) {
            if (!list[i][j])
                list[i][j] = "";
            // if(list[i][j].length<1)
            //     list[i][j]
            else
                list[i][j] = handleData(list[i][j])
        }
    }
}

export function deleteSpace(list, header) {
    if (header) {
        for (let i = 0; i < list.length - 1; i++) {
            if (list[i] === undefined || list[i].toString().length < 2)
                list.splice(i, list.length - i + 1)
        }
    } else {
        while (list[list.length - 1].toString().length < 2)
            list.pop();
    }
}

export function lengthFixer(list, flag) {
    for (let i = flag[0]; i < flag[flag.length - 1] + 1; i++) {
        if (i > flag[0] && i <= flag[1]) {
            list[i].length = list[flag[0]].length
        }
        if (i > flag[2] && i <= flag[3]) {
            list[i].length = list[flag[2]].length
        }
        if (i > flag[4] && i <= flag[5]) {
            list[i].length = list[flag[4]].length
        }
    }
}

export function dataJoin(data1, data2, data3) {
    let finalData = [];
    let data = [];
    let k = 1;
    finalData[0] = data1[0];
    finalData[0] = finalData[0].concat(',', data2[0], ',', data3[0], '\n');
    for (let a = 1; a < data1.length; a++)
        for (let b = 1; b < data2.length; b++)
            for (let c = 1; c < data3.length; c++) {
                finalData[k] = data1[a];
                finalData[k] = finalData[k].concat(',', data2[b], ',', data3[c], '\n');
                k++;
            }
    data[0] = finalData[0]
    for (let m = 0; m < finalData.length - 1; m++) {
        data[0] = data[0].concat(finalData[m + 1]);
    }
    return data
}

export function dataPush(list, flag1, flag2) {
    var newlist = [];
    for (var i = flag1; i < flag2 + 1; i++) {
        list[i] = list[i].join(',')
        newlist.push(list[i]);
    }
    return newlist;
}

export function downLoadData(filename, data) {
    data = encodeURIComponent(data)
    var downloadLink = document.createElement("a");
    downloadLink.href = "data:text/csv;charset=utf-8," + data;
    downloadLink.download = filename + ".csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}