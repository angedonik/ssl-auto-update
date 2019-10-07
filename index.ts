import {spawn} from "child_process";
import {chmodSync, chownSync, copyFileSync, existsSync, statSync} from "fs";
import {join} from "path";
import {userInfo} from "os";

const CERT_NAME='fullchain.pem';
const KEY_NAME='privkey.pem';
const CERT_DURATION=89*24*60*60*1000;
export async function checkAndUpdate(keyPath:string,certPath:string,domain:string,email:string,checkDuration:number=CERT_DURATION) {
    return new Promise((resolve,reject)=>{
        const domainFolder=getDomainFolder(domain);
        console.info('Domain Folder:',domainFolder);
        try {
            const certDate = statSync(join(domainFolder, CERT_NAME)).mtime;
            if ((Date.now() - certDate.getTime()) < checkDuration) {
                console.info('Up to date');
                copyCerts(domainFolder, keyPath, certPath);
                resolve();
                return;
            }
            else {
                console.info('Certs are too old', certDate);
            }
        }
        catch(err){
            console.info('Certs are not exist',join(domainFolder,CERT_NAME));
        }

        const p=spawn('certbot-auto',
            ['--standalone', 'certonly', '-d', domain, '--email', email, '--agree-tos', '-n'],
            {detached:false});
        p.stderr.on('data', (data) => {
            console.info(data.toString());
        });
        p.on('exit', (code) => {
            console.info(`exit ${code}`);
            if(code!==0 || !existsSync(join(domainFolder,CERT_NAME)) || !existsSync(join(domainFolder,KEY_NAME))){
                reject();
            } else {
                copyCerts(domainFolder,keyPath,certPath);
                resolve();
            }
        });
    })
}
function copyCerts(domainFolder:string,keyPath:string,certPath:string) {
    copyFileSync(join(domainFolder,KEY_NAME),keyPath);
    copyFileSync(join(domainFolder,CERT_NAME),certPath);
    chmodSync(keyPath, 0o400|0o200);
    chmodSync(certPath, 0o400|0o200);
    const {uid,gid}=userInfo();
    chownSync(keyPath,uid,gid);
    chownSync(keyPath,uid,gid);
}
function getDomainFolder(domain) {
    return `/etc/letsencrypt/live/${domain}/`
}