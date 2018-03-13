import defaultAvatar from '../images/default-user-image.png';

export class Bucketlist {
  constructor(id, item_name, date_created, date_modified, items) {
    this.item_name = item_name;
    this.id = id;
    this.date_created = date_created;
    this.date_modified = date_modified;
    this.items = items;
  }
}

export class User {
  constructor(id, username, email, avatarUrl) {
    this.username = username;
    this.email = email;
    this.id = id;
    if(avatarUrl === null){
      this.avatarUrl = defaultAvatar;
    } else {
      this.avatarUrl = avatarUrl;
    }
    console.log('AVATAR URL in MODELS: ', [avatarUrl, this.avatarUrl]);
  }
}