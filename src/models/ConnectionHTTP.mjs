
import { Connection } from "./Connection.mjs";

export class ConnectionHTTP extends Connection{
  basePath;
  constructor(connectionName,host,port,retryInterval,retryAttemps,method,basePath){
    super(connectionName,host,port,'HTTP',retryInterval,retryAttemps);
    this.basePath = basePath;
    this.method = method;
  }

  getId(){
    return this.id;
  }
};