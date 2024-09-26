import configManagerFE from '../configuration/configManager';
import axiosInstance from '../utils/axiosConfig';

// Event handler for button click
//Improve later to define one fucnton if possible,by identifying the relevant button.
//For the moment, we define four functions to be used for each button.

    export async function getMessagefromServer(path) {
      try {
        const response = await axiosInstance.get(`${configManagerFE.getConfig('apiBaseUrl')}${path}`, {
          headers: {
            "Accept": "application/json"
          }
        });

        const contentType = response.headers['content-type'];
        
        let responseData = 'Not Available';
        if (contentType.includes("application/json")) {
          responseData = JSON.stringify(response.data);
        } else if (contentType.includes("text/plain")) {
          responseData = response.data.toString();
        } else {
          responseData = 'Binary Data, Not handled.'; // For handling binary data
        }

        return responseData;
      } catch (error) {
        return 'Not Available';
      }
    }

    export async function handleDownlaod(record,type){
      let returnData='Not Available';
      switch(type){
        case 'PI':{
          if(record.pickupInboundMessagePath !== ''){
            returnData = await getMessagefromServer(`/api/messagestore/download?messagePath=${encodeURIComponent(record.pickupInboundMessagePath)}`);
          }    
          break;
        }
        case 'PO':{
          if(record.pickupOutboundMessagePath !== ''){
            returnData = await getMessagefromServer(`/api/messagestore/download?messagePath=${encodeURIComponent(record.pickupOutboundMessagePath)}`);
          }
          break;
        }
        case 'DI':{
          if(record.deliveryInboundMessagePath !== '')
            returnData = await getMessagefromServer(`/api/messagestore/download?messagePath=${encodeURIComponent(record.deliveryInboundMessagePath)}`);
          break;
        }
        case 'DO':{
          if(record.deliveryOutboundMessagePath !== ''){
            returnData = await getMessagefromServer(`/api/messagestore/download?messagePath=${encodeURIComponent(record.deliveryOutboundMessagePath)}`);
          }
            
          break;
        }
        default:{
          returnData = 'Not Available';
          break;
        }
      }

      console.log('returnData - handleDownlaod',returnData);
      return returnData;
        
    };





