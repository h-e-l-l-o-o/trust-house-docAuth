import Cookies from 'js-cookie';
import { generateUUID } from './uuid';

export function getOrSetDeviceIdentifier() {
    if (typeof window !== 'undefined') {
    let deviceIdentifier = Cookies.get('deviceIdentifier');
    
    if (!deviceIdentifier) {
      deviceIdentifier = generateUUID();
      Cookies.set('deviceIdentifier', deviceIdentifier, { expires: 365, sameSite: 'Secure' });
    }
    
    return deviceIdentifier;
  }

}
