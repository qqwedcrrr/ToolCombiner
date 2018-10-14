import styles from './index.css';
import { Component } from 'react';
import XLSX from 'xlsx'

class Tool extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bgcolor: '#e6a23c',
            filename: ''
        }
        this.handleDragLeave = this.handleDragLeave.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this)
    }

    handleDragLeave(e) {
        setTimeout(()=>{
            this.setState({
                bgcolor: '#e6a23c'
            })
        },2000)
        
    }

    handleDragOver(e) {
        e.preventDefault()
        this.setState({
            bgcolor: '#409eff'
        })
    }

    handleDrop(e) {
        e.preventDefault();
        this.setState({
            bgcolor: '#67c23a'
        })
        let file = e.dataTransfer.files;
        if (file.length < 1)
            console.warn("file didn't upload correctly!")
        else {
            let filename = file[0].name.match(/[0-9][0-9][0-9][0-9]/);
            this.setState({
                filename: 'OnStar_' + filename
            })
            try {
                this.fileReader(file[0]).then(list => {
                    let iproofFlag = this.collectProoflist(list, 'iproof')
                    let eproofFlag = this.collectProoflist(list, 'eproof', iproofFlag[iproofFlag.length - 1])
                    this.infoFixer(list, iproofFlag, eproofFlag)
                    this.createProofList(list, iproofFlag, 'iprooflist')
                    setTimeout(this.createProofList(list,eproofFlag,'eprooflist'),2000)
                    console.log(iproofFlag, eproofFlag, list)
                })

            } catch (error) {
                console.warn('excel file read err')
            }
        }
    }

    handleOnMouseLeave(e) {
        this.setState({
            bgcolor: '#e6a23c'
        })
    }

    fileReader(f) {
        let wb;
        let rABS = true;
        let _this = this
        return new Promise((res, rej) => {
            let reader = new FileReader();
            reader.onload = e => {
                let data = e.target.result;
                if (rABS) {
                    wb = XLSX.read(btoa(_this.dateFixer(data)), {
                        type: 'base64'
                    });
                } else {
                    wb = XLSX.read(data, {
                        type: 'binary'
                    });
                }
                let mainlist = _this.checkSheet(wb.Sheets)
                let proofList = XLSX.utils.sheet_to_json(mainlist, { header: 1, raw: false });
                res(proofList)
            }
            if (rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
                console.log('err')
            }
        })
    }

    dateFixer(data) {
        let o = "",
            l = 0,
            w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    }

    checkSheet(sheet) {
        for (let prop in sheet) {
            if (prop.toLowerCase().indexOf('proof_seed') > -1)
                return sheet[prop]
        }
    }
    //Accord to the type to generate the iproof list and eproof list
    collectProoflist(list, type, offset) {
        let flag = [];
        let i = 0
        if (type === 'eproof') {
            i += offset + 1
        }
        for (; i < list.length; i++) {
            if (list[i][0] === undefined)
                continue;
            if (list[i][0].toLowerCase().includes(type)) {
                flag[0] = ++i;
                this.deleteSpace(list[flag[0]])
                flag[1] = this.formerProofInfoInList(list, flag[0]);
                i = flag[1] + 1;
                continue;
            }
            if ((list[i][0].toLowerCase().includes('static')) &&
                (list[i][0].toLowerCase().includes('attributes'))) {
                flag[2] = ++i;
                this.deleteSpace(list[flag[2]]);
                flag[3] = this.formerProofInfoInList(list, flag[2]);
                i = flag[3] + 1;
                continue;
            }
            if ((list[i][0].toLowerCase().includes('dynamic')) &&
                (list[i][0].toLowerCase().includes('attributes'))) {
                flag[4] = ++i;
                this.deleteSpace(list[flag[4]]);
                flag[5] = this.formerProofInfoInList(list, flag[4]);
                return flag
            }
        }
    }

    deleteSpace(list) {
        while (list[list.length - 1].length < 2) {
            list.pop();
        }
    }
    //We choose some variable as key to define the length of information.
    //Here are the three keys: EMAIL_ADDRESS, recip_type,CAMPAIGN_ID
    formerProofInfoInList(list, index) {
        let key
        for (let i = 0; i < list[index].length; i++) {
            let tag = list[index][i].toLowerCase();
            if ((tag.includes('email') && tag.includes('address')) ||
                (tag.includes('recip') && tag.includes('type')) ||
                (tag.includes('campaign') && tag.includes('id')))
                key = i
        }
        for (; index < list.length; index++) {
            if (list[index][key] === undefined || list[index][key].length < 2)
                return index - 1
        }
    }

    infoFixer(list, iproofFlag, eproofFlag) {
        this.lengthFixer(list, iproofFlag);
        this.lengthFixer(list, eproofFlag);
        for (var i = 0; i < eproofFlag[eproofFlag.length - 1] + 1; i++) {
            for (var j = 0; j < list[i].length; j++) {
                if (!list[i][j])
                    list[i][j] = "";
                // if(list[i][j].length<1)
                //     list[i][j]
                else
                    list[i][j] = this.handleData(list[i][j])
            }
        }
    }

    lengthFixer(list, flag) {
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

    handleData(value) {
        let data = value.replace(/#|(><)/g, '')
        data = data.replace(/\*/g, "")
            .replace(/\t/g, ',')
            .replace(/(^\s*)|(\s*$)/g, "")
            .split('\n')
        return data
    }

    dataPush(list, flag1, flag2) {
        var newlist = [];
        for (var i = flag1; i < flag2 + 1; i++) {
            list[i] = list[i].join(',')
            newlist.push(list[i]);
        }
        return newlist;
    }

    dataJoin(data1, data2, data3) {
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

    createProofList(list, flag, type) {
        let data1 = this.dataPush(list, flag[0], flag[1]);
        let data2 = this.dataPush(list, flag[2], flag[3])
        let data3 = this.dataPush(list, flag[4], flag[5])
        let data = this.dataJoin(data1, data2, data3)
        this.downLoadData(this.state.filename + type, data)
    }

    downLoadData(filename, data) {
        data = encodeURIComponent(data)
        var downloadLink = document.createElement("a");
        downloadLink.href = "data:text/csv;charset=utf-8," + data;
        downloadLink.download = filename + ".csv";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    render() {
        return (
            <div className={styles.container}>
                <div >
                    <p>Welcome to the onStar prooflist generator!</p>
                </div>
                <p className={styles.headerPad}>Please put the CWS here</p>
                <div style={{ background: this.state.bgcolor }} className={styles.dragArea}
                    onDragOver={this.handleDragOver}
                    onDragLeave={this.handleDragLeave}
                    onDrop={this.handleDrop}
                    onMouseLeave={this.handleOnMouseLeave} >
                </div>
            </div>
        )
    }
}

export default Tool
