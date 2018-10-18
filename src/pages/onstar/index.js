import styles from './index.css';
import { Component } from 'react';
import {
    fileReader, downLoadData,
    infoFixer, deleteSpace,
    dataPush, dataJoin
} from './../../common/common'
import router from 'umi/router';
import { Button } from 'antd'


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
        setTimeout(() => {
            this.setState({
                bgcolor: '#e6a23c'
            })
        }, 2000)

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
                filename: 'OnStar_' + filename + '_'
            })
            try {
                fileReader(file[0]).then(list => {
                    let iproofFlag = this.collectProoflist(list, 'iproof')
                    let eproofFlag = this.collectProoflist(list, 'eproof', iproofFlag[iproofFlag.length - 1])
                    infoFixer(list, iproofFlag, eproofFlag)
                    this.createProofList(list, iproofFlag, 'iprooflist')
                    setTimeout(this.createProofList(list, eproofFlag, 'eprooflist'), 2000)
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

    componentDidMount() {
        localStorage.setItem('autoRoute', '/onstar');
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
                deleteSpace(list[flag[0]], true)
                flag[1] = this.formerProofInfoInList(list, flag[0]);
                i = flag[1] + 1;
                continue;
            }
            if ((list[i][0].toLowerCase().includes('static')) &&
                (list[i][0].toLowerCase().includes('attributes'))) {
                flag[2] = ++i;
                deleteSpace(list[flag[2]], true);
                flag[3] = this.formerProofInfoInList(list, flag[2]);
                i = flag[3] + 1;
                continue;
            }
            if ((list[i][0].toLowerCase().includes('dynamic')) &&
                (list[i][0].toLowerCase().includes('attributes'))) {
                flag[4] = ++i;
                deleteSpace(list[flag[4]], true);
                flag[5] = this.formerProofInfoInList(list, flag[4]);
                return flag
            }
        }
    }

    //We choose some variable as key to define the length of information.
    //Here are the three keys: EMAIL_ADDRESS, recip_type,SPLIT_CODE
    formerProofInfoInList(list, index) {
        let key
        for (let i = 0; i < list[index].length; i++) {
            if (list[index][i] === undefined)
                continue;
            let tag = list[index][i].toLowerCase();
            if ((tag.includes('email') && tag.includes('address')) ||
                (tag.includes('recip') && tag.includes('type')) ||
                (tag.includes('split') && tag.includes('code'))) {
                key = i
                for (; index < list.length; index++) {
                    if (list[index][key] === undefined || list[index][key] === "" ||
                        list[index][key].toString().length < 2)
                        return index - 1
                }
            }
        }
    }

    createProofList(list, flag, type) {
        let data1 = dataPush(list, flag[0], flag[1]);
        let data2 = dataPush(list, flag[2], flag[3])
        let data3 = dataPush(list, flag[4], flag[5])
        let data = dataJoin(data1, data2, data3)
        downLoadData(this.state.filename + type, data)
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
                <div className={styles.goback}>
                    <Button onClick={() => {
                        localStorage.removeItem('autoRoute');
                        router.push('/');
                    }}>
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }
}

export default Tool