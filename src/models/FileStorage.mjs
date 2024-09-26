import { Storage } from './Storage.mjs';
import fs from 'fs';
import path from 'path';
import {v4 as uuidv4} from 'uuid';

export class FileStorage extends Storage {
    _storageLocation;
    
    get storageLocation() {
      return this._storageLocation;
    }
    set storageLocation(value) {
      this._storageLocation = value;
    }
 
    constructor(storageType){
     super(storageType);
    }
 
     getCurrentDateHour() {
         const now = new Date();
         const year = now.getFullYear();
         const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
         const day = String(now.getDate()).padStart(2, '0');
         const hour = String(now.getHours()).padStart(2, '0');
       
         return `${year}/${month}/${day}/${hour}`;
     }
 
     createDirectory(dirPath) {
       if (!fs.existsSync(dirPath)) {
         fs.mkdirSync(dirPath, { recursive: true });
       }
     }
 
     async storeMessage(payload) {
      
       const baseDir = path.join(this.storageLocation, 'storage'); // Base directory for storage
       const dateHour = this.getCurrentDateHour();
       const folderPath = path.join(baseDir, dateHour);
     
       await this.createDirectory(folderPath);
     
       console.log(`Directory created: ${folderPath}`);
     
       //Store file
       const filePath = await path.join(folderPath,  uuidv4());
       await fs.writeFileSync(filePath, payload);
     
       console.log(`File created: ${filePath}`);
       return await `${filePath}`;
     }

    async getMessage(id){
      try{
        const payload = await fs.readFileSync(id,'utf8');
        console.log('payload',await payload);
        return await payload;
      }catch(error) {
        return undefined;
      }
    }     
      
}