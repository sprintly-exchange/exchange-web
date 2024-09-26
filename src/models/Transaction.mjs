import {v4 as uuidv4} from 'uuid';

// Classes related to store the tranaction configruation
export class Transaction{
    id;
    flowName='';
    parentId='';
    childId='';
    pickupId='';
    pickupProtocol='';
    pickupHost='';
    pickupPort='';
    pickupPath='';
    pickupMessageName='';
    pickupMessageSize=0;
    pickupInboundMessageName='';
    pickupInboundMessageSize=0;
    pickupOutboundMessageName='';
    pickupOutboundMessageSize=0;
    pickupName='';
    pickupTime='';
    pickupStatus='';
    pickupStatusCode='';
    deliveryId='';
    deliveryProtocol='';
    deliveryHost='';
    deliveryPort='';
    deliveryPath='';
    deliveryMessageName='';
    deliverMessageSize=0;
    deliveryName='';
    deliveryTime='';
    deliveryStatus='';
    deliveryStatusCode='';
    

    constructor(processingTime,status,pickupId,pickupProtocol,pickupHost,pickupPort,pickupName,deliveryId,deliveryProtocol,deliveryHost,deliveryPort,deliveryName,processingId,parentId,childId,flowName){
      this.id = uuidv4();
      this.deliveryStatus = status;
      this.processingTime = processingTime;
      this.pickupId = pickupId;
      this.pickupProtocol = pickupProtocol;
      this.pickupHost = pickupHost;
      this.pickupPort = pickupPort;
      this.pickupName = pickupName;
      this.deliveryId = deliveryId;
      this.deliveryProtocol = deliveryProtocol;
      this.deliveryHost = deliveryHost;
      this.deliveryPort = deliveryPort;
      this.deliveryName = deliveryName;
      this.processingId = processingId;
      this.parentId = parentId;
      this.childId = childId;
      this.flowName = flowName;

    }

    getId(){
      return this.id;
    }
 }

export default Transaction;