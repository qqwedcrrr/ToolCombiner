import XLSX from 'xlsx';
import { func } from 'prop-types';

export function fileReader(f, brand) {
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
            let mainlist
            if (brand === 'onstar')
                mainlist = onstarCheckSheet(wb.Sheets)
            if (brand === 'nespresso')
                mainlist = nespressoCheckSheet(wb.Sheets)
            else
                res(wb.Sheets)
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

export function nespressoCheckSheet(sheet) {
    for (let prop in sheet) {
        if (prop.toLowerCase().indexOf('et') > -1 && prop.toLowerCase().indexOf('url') > -1)
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
    return data.toString()
}

export function infoFixer(list, iproofFlag, eproofFlag) {
    let length, clear;
    let deletBox = []
    if (iproofFlag)
        lengthFixer(list, iproofFlag);
    if (eproofFlag) {
        lengthFixer(list, eproofFlag);
        length = eproofFlag[eproofFlag.length - 1] + 1
    }
    else {
        length = list.length;
        clear = true
    }
    for (let i = 0; i < length; i++) {
        if (clear) {
            if (list[i] !== undefined && list[i].toString().length < 2) {
                deletBox.push(i)
            }
        }
        for (var j = 0; j < list[i].length; j++) {
            if (!list[i][j])
                list[i][j] = "";
            else
                list[i][j] = handleData(list[i][j])
        }
    }
    for (let i = deletBox.length - 1; i >= 0; i--)
        list.splice(deletBox[i], 1)
}

//The duplicate element usually is the emailaddress in Dynamic, so I start seek the duplicate element from Dynamic.
export function duplicateNameCheck(list, flag) {
    let checklist = [];
    let errorList = [];
    flag = [flag[0], flag[2], flag[4]]
    for (let i = 0; i < flag.length; i++) {
        for (let j = 0; j < list[flag[i]].length; j++) {
            if (!checklist.includes(list[flag[i]][j]))
                checklist.push(list[flag[i]][j])
            else
                errorList.push(list[flag[i]][j])
        }
    }
    if (errorList.length > 0)
        return errorList
}

export function phonecallFixer(string){
    return string.match(/[0-9]/g).join().replace(/,/g,'')
}

export function deleteSpace(list, header) {
    if (header) {
        for (let i = 0; i < list.length - 1; i++) {
            if (list[i] === undefined || list[i].toString().replace(/ /g, '').length < 1)
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

export const WarNoop = ({ errlist }) => {
    if (Array.isArray(errlist) && errlist.length > 0) {
        errlist = errlist.join(';')
        return (
            <p style={{ color: '#595959' }}><span style={{ color: '#DD4A68' }}>{errlist}</span> these are duplicate table cell name</p>
        )
    } else
        return (
            <span></span>
        )
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