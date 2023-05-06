import { Schema, model, Document} from 'mongoose';

export interface Allergene extends Document {
    readonly _id: Schema.Types.ObjectId,
    allergene: string,
    isPresentOn : Schema.Types.ObjectId[]
}

const allergeneSchema = new Schema<Allergene>({
    allergene : {
      type: Schema.Types.String,
      required: true,
    },
    isPresentOn : {
        type : [
            {
                type: Schema.Types.ObjectId,
                required: false, 
                ref : 'Item'
            },
        ],
        required : true

    }   
});
  
export const AllergeneModel = model<Allergene>('Allergene', allergeneSchema);