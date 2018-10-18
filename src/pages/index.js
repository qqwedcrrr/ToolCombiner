import styles from './index.css';
import Link from 'umi/link';
import router from 'umi/router';
import {Button} from 'antd'

export default function() {
  let autoRoute = localStorage.getItem('autoRoute')
  if(autoRoute !==null)
    router.push(autoRoute)
  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <p>To get started, choose a tool to go!</p>
      <div className={styles.linkcontainer}>
        <ul className={styles.list}>
          <li><Button onClick={()=>{router.push('/nespresso')}} className={styles.gotolink}>Go to Nespresso Tool</Button></li>
          <li><Button onClick={()=>{router.push('/onstar')}} className={styles.gotolink}>Go to OnStar Tool</Button></li>
        </ul>
      </div>
    </div>
  );
}
