import styles from './index.css';
import { Component } from 'react';

export default class NespressoTool extends Component{
    render(){
        return(
            <div>
                <p>heh</p>
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