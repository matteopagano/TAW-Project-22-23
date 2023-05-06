import { Schema, model, Document, SchemaTypes} from 'mongoose';
import crypto = require('crypto');


export interface Owner extends Document {

    readonly _id: Schema.Types.ObjectId,

    username: string,
    mail: string,
    salt: string,    // salt is a random string that will be mixed with the actual password before hashing
    digest: string,  // this is the hashed password (digest of the password)

    restaurantName: Schema.Types.ObjectId;
    usersList: Schema.Types.ObjectId[]; // List of users of his/her restaurant, currently working

    setPassword: (pwd : string) => void,
    validatePassword: (pwd : string) => boolean,
}

const ownerSchema = new Schema<Owner>( {
    username: {
        type: SchemaTypes.String,
        required: true
    },
    mail: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    
    salt:  {
        type: SchemaTypes.String,
        required: false 
    },
    digest:  {
        type: SchemaTypes.String,
        required: false 
    },
    restaurantName:  {
        type : Schema.Types.ObjectId,
        required: false,
        ref : 'Restaurant'
    },
    usersList:  [{
        idUser : {
            type : Schema.Types.ObjectId,
            ref : 'User'
        },
        required : false
    }]
})

ownerSchema.methods.setPassword = function( pwd : string ) {

    this.salt = crypto.randomBytes(16).toString('hex'); // We use a random 16-bytes hex string for salt

    // We use the hash function sha512 to hash both the password and salt to
    // obtain a password digest 
    // 
    // From wikipedia: (https://en.wikipedia.org/wiki/HMAC)
    // In cryptography, an HMAC (sometimes disabbreviated as either keyed-hash message 
    // authentication code or hash-based message authentication code) is a specific type 
    // of message authentication code (MAC) involving a cryptographic hash function and 
    // a secret cryptographic key.
    //
    const hmac = crypto.createHmac('sha512', this.salt );

    hmac.update( pwd );

    this.digest = hmac.digest('hex'); // The final digest depends both by the password and the salt
}

ownerSchema.methods.validatePassword = function( pwd : string ) : boolean {

    // To validate the password, we compute the digest with the
    // same HMAC to check if it matches with the digest we stored
    // in the database.
    //
    const hmac = crypto.createHmac('sha512', this.salt );

    hmac.update(pwd);

    const digest = hmac.digest('hex');

    return (this.digest === digest);
}

export const OwnerModel = model('Owner', ownerSchema)