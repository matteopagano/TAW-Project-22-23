import mongoose from 'mongoose';

export interface Allergene extends mongoose.Document {
    readonly _id: mongoose.Schema.Types.ObjectId,
    allergene: string,
    isPresentOn : mongoose.Schema.Types.ObjectId[]
}

const tagSchema = new mongoose.Schema<Allergene>({
    allergene: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    isPresentOn: [{
        type: mongoose.SchemaTypes.ObjectId,
        required: false, 
        ref : 'Item'
    }]
});
  
export const TagModel = mongoose.model<Allergene>('Allergene', tagSchema);