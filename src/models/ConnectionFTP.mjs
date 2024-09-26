import { Connection } from "./Connection.mjs";

export class ConnectionFTP extends Connection{
    path;
    constructor(connectionName,path,retryInterval,retryAttemps){
      super(connectionName,'localhost',0,'FS',retryInterval,retryAttemps)
      this.path = path;
    }
  
    getId(){
      return this.id;
    }
  };