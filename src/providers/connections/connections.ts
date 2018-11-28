import { Network } from '@ionic-native/network';
import { Injectable } from '@angular/core';

/*
  Generated class for the ConnectionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConnectionsProvider {

  constructor(public network: Network) {
      
  }
  Onconnection(){
    // watch network for a disconnect
    let connect=1;
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    console.log('network was disconnected :-(');
    connect=0;
    });
    // stop disconnect watch
    disconnectSubscription.unsubscribe();
    return connect;
  }
}
