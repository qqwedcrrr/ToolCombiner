import styles from './index.less';
import { Component } from 'react';
import router from 'umi/router';
import { Button } from 'antd'

let ButtonAlias = ({aliasName,aliasNumber}) => (
    <div className={styles.buttoncontainer}>
        <p>{aliasName}</p>
        <Button>+</Button>
        <Button>-</Button>
        <p>{aliasNumber}</p>
    </div>
)

export default class NespressoTool extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bgcolor: '#e6a23c',
            aliasName:'null',
            aliasNumber:'1'
        }

        this.handleDragLeave = this.handleDragLeave.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this)
    }

    handleOnMouseLeave(e) {
        this.setState({
            bgcolor: '#e6a23c'
        })
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
            try {
                this.fileReader(file[0]).then(list => {

                })
            } catch (error) {
                console.warn('excel file read err')
            }
        }
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.maincontainer}>
                    <div className={styles.masking}
                        style={{ background: this.state.bgcolor }}
                        onDragOver={this.handleDragOver}
                        onDragLeave={this.handleDragLeave}
                        onDrop={this.handleDrop}
                        onMouseLeave={this.handleOnMouseLeave}>
                    </div>
                    <div className={styles.hovertext}>
                        <p className={styles.hovertext}>Please drag the CWS here!</p>
                    </div>
                    <div className={styles.codeinput}>
                        <textarea placeholder="Place your code"></textarea>
                    </div>
                    <div className={styles.alias_link}>
                        <ul>
                            <li><ButtonAlias aliasName={this.state.aliasName} aliasNumber={this.state.aliasNumber} /></li>
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
}

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