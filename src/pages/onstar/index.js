import styles from './index.css';
import { Component } from 'react';
import {
    fileReader, downLoadData,
    infoFixer, deleteSpace,
    dataPush, dataJoin,
    duplicateNameCheck, WarNoop
} from './../../common/common'
import router from 'umi/router';
import { Button } from 'antd'


class Tool extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bgcolor: '#e6a23c',
            filename: '',
            error: ''
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
            fileReader(file[0],'onstar').then(list => {
                let iproofFlag = this.collectProoflist(list, 'iproof')
                let eproofFlag = this.collectProoflist(list, 'eproof', iproofFlag[iproofFlag.length - 1])
                infoFixer(list, iproofFlag, eproofFlag)
                try {
                    let errorlist = duplicateNameCheck(list, iproofFlag)
                    if (errorlist.length > 0) {
                        throw errorlist
                    }
                } catch (errorlist) {
                    this.setState({
                        error: errorlist
                    })
                    console.warn(errorlist)
                } finally {
                    this.createProofList(list, iproofFlag, 'iprooflist')
                    setTimeout(this.createProofList(list, eproofFlag, 'eprooflist'), 2000)
                }

            })
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
                flag[1] = this.formerProofInfoInList(list, flag[0], 1);
                i = flag[1] + 1;
                continue;
            }
            if ((list[i][0].toLowerCase().includes('static')) &&
                (list[i][0].toLowerCase().includes('attributes'))) {
                flag[2] = ++i;
                deleteSpace(list[flag[2]], true);
                flag[3] = this.formerProofInfoInList(list, flag[2], 2);
                i = flag[3] + 1;
                continue;
            }
            if ((list[i][0].toLowerCase().includes('dynamic')) &&
                (list[i][0].toLowerCase().includes('attributes'))) {
                flag[4] = ++i;
                deleteSpace(list[flag[4]], true);
                flag[5] = this.formerProofInfoInList(list, flag[4], 3);
                return flag
            }
        }
    }

    //We choose some variable as key to define the length of information.
    //Here are the three keys: EMAIL_ADDRESS, recip_type,VEH_MAKE_DESC
    formerProofInfoInList(list, index, num) {
        let key, part, tag;
        let checklist = []
        for (let i = 0; i < list[index].length; i++) {
            if (list[index][i] === undefined)
                continue;
            tag = list[index][i].toLowerCase();
            switch (num) {
                case 1:
                    part = {
                        one: 'email',
                        two: 'address'
                    }
                    break;
                case 2:
                    part = {
                        one: 'recip',
                        two: 'type'
                    }
                    break;
                case 3:
                    part = {
                        one: 'veh',
                        two: 'make'
                    }
                    break;
                default: console.warn('find proof flag err')
            }
            if (tag.includes(part.one) && tag.includes(part.two)) {
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
                <div className={styles.topPadding}>
                    <p>Welcome to the onStar prooflist generator!</p>
                </div>
                <p>Please put the CWS here</p>
                <p>Please insure the these three key header <em>EMAIL_ADDRESS</em>, <em>recip_type</em>,<em>VEH_MAKE_DESC </em>
                    table value length are longer than <span style={{ color: '#d32652' }}>TWO</span></p>
                <WarNoop errlist={this.state.error} />
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
