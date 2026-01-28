import { NFC, Reader } from "nfc-pcsc";
import { Logger } from "../log/logger";

interface Card {
  uid: string;
}

type IReader = typeof Reader;

const nfc = new NFC();
const logger = new Logger();

export class CardReader {
    static win = null;
    static ready(
        callback_pasori_ready: CallableFunction,
        pasori_card_touch: CallableFunction,
        pasori_card_remove: CallableFunction,
    ) {
        logger.debug('ready go, in Reader');
        nfc.on('reader', (reader:IReader)=>{
            const device_name = reader.reader.name;
            logger.debug(`Device ready (${device_name})`);
            callback_pasori_ready(device_name);
            reader.on('card', async (card:Card ) => {
                logger.debug(`IC Card touched`);
                logger.debug(card);
                pasori_card_touch(card.uid);

            });
            reader.on('card.off', (card: Card)=>{
                logger.debug(`IC Card removed`);
                logger.debug(card);
                pasori_card_remove()
            })
            reader.on('error', (err:Error) => {
                console.log(`${reader.reader.name}  an error occurred`, err);
            });
            reader.on('end', () => {
                console.log(`device removed (${reader.reader.name})`);
            });
        })
        nfc.on('error', (err:Error) => {
	        console.log('an error occurred', err);
        });

    }

}
