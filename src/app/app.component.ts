import { Component } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public running = false;
  public loaded = false;
  public count = 0;
  public time = 0;

  constructor(private afs: AngularFirestore, private service: FirestoreService) {

  }

  getSimple() {
    const tick = this.startRun();
    this.afs.collection('items').valueChanges().subscribe(c => this.collectionLoaded(c, tick));
  }

  getCol() {
    const tick = this.startRun();
    this.service.col$('items').subscribe(c => this.collectionLoaded(c, tick));
  }

  getColWithIds() {
    const tick = this.startRun();
    this.service.colWithIds$('items').subscribe(c => this.collectionLoaded(c, tick));
  }

  getDetailedCol() {
    const tick = this.startRun();
    this.service.col$('items-detailed').subscribe(c => this.collectionLoaded(c, tick));
  }

  getDetailedColWithIds() {
    const tick = this.startRun();
    this.service.colWithIds$('items-detailed').subscribe(c => this.collectionLoaded(c, tick));
  }

  startRun() {
    this.running = true;
    console.log('Starting Test Run');
    return new Date().getTime();
  }

  collectionLoaded(collection, tick) {
    const tock = (new Date().getTime() - tick) / 1000;
    console.log(`Loaded Collection in ${tock}s`);
    this.count = collection.length;
    this.time = tock;
    this.running = false;
    this.loaded = true;
  }
}
