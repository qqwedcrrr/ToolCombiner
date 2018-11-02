import styles from './index.css';
import Link from 'umi/link';
import router from 'umi/router';

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
          <li><button onClick={()=>{router.push('/nespresso');localStorage.setItem('autoRoute', '/nespresso');}} className="antButton">Go to Nespresso Tool</button></li>
          <li><button onClick={()=>{router.push('/onstar');localStorage.setItem('autoRoute', '/onstar');}} className="antButton">Go to OnStar Tool</button></li>
        </ul>
      </div>
    </div>
  );
}
