import {v4 as uuidv4} from 'uuid';

export class MessageStore{
    _id;
    _messageName;
  
    constructor(){
      this.id = uuidv4()
    }
  
     get messageName() {
       return this._messageName;
     }
     set messageName(value) {
       this._messageName = value;
     }
     get id() {
       return this._id;
     }
     set id(value) {
       this._id = value;
     }
  
     _deliveryOutboundMessageSize = 0;
     get deliveryOutboundMessageSize() {
       return this._deliveryOutboundMessageSize;
     }
     set deliveryOutboundMessageSize(value) {
       this._deliveryOutboundMessageSize = value;
     }
     _deliveryInbondMessageSize = 0;
     get deliveryInbondMessageSize() {
       return this._deliveryInbondMessageSize;
     }
     set deliveryInbondMessageSize(value) {
       this._deliveryInbondMessageSize = value;
     }
     _pickupInboundMessageSize = 0;
     get pickupInboundMessageSize() {
       return this._pickupInboundMessageSize;
     }
     set pickupInboundMessageSize(value) {
       this._pickupInboundMessageSize = value;
       this.pickupInboundMessageSize = new Blob([value]).size;
     }
     _pickupOutboundMessageSize = 0;
     get pickupOutboundMessageSize() {
       return this._pickupOutboundMessageSize;
     }
     set pickupOutboundMessageSize(value) {
       this._pickupOutboundMessageSize = value;
     }
  
     _deliveryOutboundMessage='';
     get deliveryOutboundMessage() {
       return this._deliveryOutboundMessage;
     }
     set deliveryOutboundMessage(value) {
       this._deliveryOutboundMessage = value;
       this._deliveryOutboundMessageSize = new Blob([value]).size;
     }
    
     _pickupOutboundMessage='';
     get pickupOutboundMessage() {
       return this._pickupOutboundMessage;
     }
     set pickupOutboundMessage(value) {
       this._pickupOutboundMessage = value;
       this.pickupOutboundMessageSize = new Blob([value]).size;
     }
  
    _pickupInoundMessage = '';
    get pickupInoundMessage() {
        return this._pickupInoundMessage;
    }
    set pickupInoundMessage(value) {
        this._pickupInoundMessage = value;
        this.pickupInboundMessageSize = new Blob([value]).size;
    }
    _responseInboundMessage = '';
    get responseInboundMessage() {
        return this._responseInboundMessage;
    }
    set responseInboundMessage(value) {
        this._responseInboundMessage = value;
        this.deliveryInbondMessageSize = new Blob([value]).size;
    }
    _pickupInoundMessage = '';
    get pickupInoundMessage() {
        return this._pickupInoundMessage;
    }
    set pickupInoundMessage(value) {
        this._pickupInoundMessage = value;
        this.pickupOutboundMessageSize = new Blob([value]).size;
    }
    _deliveryOutboundMessage = '';
    get deliveryOutboundMessage() {
        return this._deliveryOutboundMessage;
    }
    set deliveryOutboundMessage(value) {
        this._deliveryOutboundMessage = value;
        this.deliveryOutboundMessageSize = new Blob([value]).size;
    }
  }
  