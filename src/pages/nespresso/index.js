import styles from './index.less';
import router from 'umi/router';
import { Button } from 'antd';
import { connect } from 'dva';
import {
    fileReader,
    infoFixer, phonecallFixer,
    dataPush, dataJoin,
    duplicateNameCheck, WarNoop
} from './../../common/common'


let ButtonAlias = ({ alias, dispatch }) => {
    return (
        <div>
            <div className={styles.buttoncontainer}>
                <p className={styles.aliasname}>{alias.aliasName}</p>
                <Button style={{ float: 'left' }} onClick={() => {
                    dispatch({ type: 'nespresso/addNum', payload: alias.id })
                }}>+</Button>
                <Button style={{ float: 'left' }} onClick={() => {
                    dispatch({ type: 'nespresso/reduceNum', payload: alias.id })
                }}>-</Button>
                <p>{alias.num}</p>
                <p className={styles.aliaslink}>{alias.link}</p>
            </div>
        </div>
    )
}

const NespressoTool = ({ dispatch, nespresso }) => {
    let code

    function handleOnMouseLeave() {
        dispatch({
            type: 'nespresso/changeColor',
            payload: '#e6a23c'
        })
    }

    function handleDragLeave() {
        setTimeout(() => {
            dispatch({
                type: 'nespresso/changeColor',
                payload: '#e6a23c'
            })
        }, 300)
    }

    function handleDragOver(e) {
        e.preventDefault()
        dispatch({
            type: 'nespresso/changeColor',
            payload: '#409eff'
        })
    }

    function handleDrop(e) {
        e.preventDefault();
        dispatch({
            type: 'nespresso/changeColor',
            payload: '#67c23a'
        })
        let file = e.dataTransfer.files;
        if (file.length < 1)
            console.warn("file didn't upload correctly!")
        else {
            try {
                fileReader(file[0], 'nespresso').then(list => {
                    let mainInfo = collectInfolist(list)
                    dispatch({ type: 'nespresso/setAlias', payload: mainInfo })
                    dispatch({ type: 'nespresso/maskRemove' })

                    console.log(mainInfo)
                })
            } catch (error) {
                console.warn('excel file read err')
            }
        }
    }

    function collectInfolist(list) {
        let mainInfo = [];
        let info;
        for (let i = 0; i < list.length; i++) {
            if (list[i][0] === undefined)
                continue;
            if ((list[i][0].toLowerCase().includes('link')) &&
                (list[i][0].toLowerCase().includes('instruction'))) {
                i += 1;
                console.log(list.length)
                infoFixer(list)
                console.log(list)
                for (let id = 0; i < list.length; i++) {    
                    if ((list[i][5].toLowerCase().includes('click')) &&
                        (list[i][5].toLowerCase().includes('call')))
                        list[i][5] = 'tell:' + phonecallFixer(list[i][5])
                    info = {
                        aliasName: list[i][1],
                        id: id++,
                        num: id > 6 && id < list.length - 14 ? 1 : 0,
                        link: list[i][5],
                    }
                    mainInfo.push(info)
                }
            }
        }
        return mainInfo
    }

    function onTransferClick() {
        let alias = nespresso.alias
        for(let i = 0 ; i<alias.length; i++){
            if(alias[i].num === 1){
                code.value = code.value.replace("Alias_Defined_in_CWS",alias[i].aliasName)
            }if(alias[i].num >1){
                for(let num = 1;num<alias[i].num+1;num++){
                    code.value = code.value.replace("Alias_Defined_in_CWS",alias[i].aliasName+"_"+num)     
                }
            }
            if(alias[i].link.toLowerCase().includes('tell:')){
                code.value = code.value.replace(/(href=").*?\?_*(URL_REPLACE).*?"/,'href="'+alias[i].link+'"')
            }else{
                code.value = code.value.replace("____URL_REPLACE____",alias[i].link)
            }
        }
    }

    function linkReplace(string,value){

    }

    return (
        <div className={styles.container}>
            <div className={styles.maincontainer}>
                <div className={styles.masking}
                    style={{ background: nespresso.bgcolor, visibility: nespresso.cover ? 'visible' : 'hidden' }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onMouseLeave={handleOnMouseLeave}>
                </div>
                <div className={styles.hovertext}
                    style={{ visibility: nespresso.cover ? 'visible' : 'hidden' }}>
                    <p className={styles.hovertext}>Please drag the CWS here!</p>
                </div>
                <div className={styles.codeinput}>
                    <textarea ref={(node) => code = node} placeholder="Place your code"></textarea>
                    <Button onClick={onTransferClick}>Click to transfer</Button>
                </div>
                <div className={styles.aliascontainer}>
                    <ul>
                        {
                            nespresso.alias.map(data => (
                                <li><ButtonAlias key={data.id} dispatch={dispatch} alias={data} /></li>
                            ))
                        }
                    </ul>
                </div>
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

export default connect(({ nespresso }) => ({ nespresso }))(NespressoTool)



// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <title>Automatically fill alias name and links</title>
//   <script src="http://pages.email.nespresso.com/JqueryJS/"></script>

// <script>
// $(function(){

//   $("input").click(function(){

//          var textContainer = $("#linksBox").val().split('\n');  
//          var htmlContainer = $("#htmlBox").val(); 

//         for(var i=0; i<textContainer.length; i++){
//           htmlContainer = htmlContainer.replace("Alias_Defined_in_CWS",textContainer[i].split('\t')[0]);
//           htmlContainer = htmlContainer.replace("____URL_REPLACE____",textContainer[i].split('\t')[3]);         
//         }  
//         console.log(htmlContainer);
//          $("#htmlBox").val(htmlContainer); 
//   });
// })

// </script>

// </head>
// <body style="padding-top:50px;">

// <div style="padding:25px 20%;">
//   <textarea id="linksBox" placeholder="Please input alias and links here" style="width: 100%; height:200px;"></textarea>
//   <textarea id="htmlBox" placeholder="Please put your html code here" style="width: 100%; height:500px; margin-top:20px;"></textarea>
//   <input type="button" value="Submit" style="display:block;">
//   <div id="showResults"></div>
// </div>


// </body>
// </html>