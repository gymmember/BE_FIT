import https from 'https';
import fs from 'fs';

const url = 'https://instagram.fccu16-1.fna.fbcdn.net/v/t51.2885-19/494786146_17861717628392499_6889077744927718623_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.fccu16-1.fna.fbcdn.net&_nc_cat=103&_nc_oc=Q6cZ2gFAyX5ZZZWFG94jKQe_wPLHgAI8sJPisTtRqpBk3AU-On5nXDMBmhAGNSlZFS8eLBI&_nc_ohc=bQY3nCbi0ygQ7kNvwHNFMqS&_nc_gid=n4hSH559lwGEmUWbU86cEw&edm=APoiHPcBAAAA&ccb=7-5&oh=00_Af7-eaQienxqhGd07kNgp7VUoE59B5PXfPjyJXbdve698w&oe=6A1E19FC&_nc_sid=22de04';

https.get(url, (res) => {
  if (res.statusCode === 200) {
    res.pipe(fs.createWriteStream('public/logo.jpg'));
    console.log('Downloaded successfully.');
  } else {
    console.error('Failed to download. Status code: ' + res.statusCode);
  }
}).on('error', (e) => {
  console.error('Error fetching image:', e);
});
