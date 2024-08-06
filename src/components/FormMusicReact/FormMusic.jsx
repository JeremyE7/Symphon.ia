import React, { useState } from 'react';
import styles from './FormMusic.module.css';
import { playSound } from '../../utils/generateSound';
import { zzfx, zzfxG, zzfxP, zzfxR, zzfxV } from '../../utils/zzfx';
import { zzfxM } from '../../utils/zzfxm';

function float32ArrayToWav(buffer, sampleRate = 44100) {
    const WAV_HEAD_SIZE = 44;
    const dataLength = buffer.length * 2;
    const bufferLength = dataLength + WAV_HEAD_SIZE;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    writeString(view, 0, 'RIFF'); // RIFF header
    view.setUint32(4, 36 + dataLength, true); // file length
    writeString(view, 8, 'WAVE'); // WAVE header
    writeString(view, 12, 'fmt '); // fmt chunk
    view.setUint32(16, 16, true); // length of fmt
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true); // sample rate
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(view, 36, 'data'); // data chunk
    view.setUint32(40, dataLength, true); // data length

    let offset = 44;
    for (let i = 0; i < buffer.length; i++, offset += 2) {
        const sample = Math.max(-1, Math.min(1, buffer[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    }

    return new Blob([view], { type: 'audio/wav' });
}

const parse = str => {
    str = str.replace(/\[,/g,'[null,')
      .replace(/,,\]/g,',null]')
      .replace(/,\s*(?=[,\]])/g,',null')
      .replace(/([\[,]-?)(?=\.)/g,'$10')
      .replace(/-\./g,'-0.');

    return JSON.parse(str, (key, value) => {
      if (value === null) {
        return undefined;
      }
      return value;
    });
  };

  const render = song => {
    return new Promise(resolve => {
      setTimeout(() => resolve(zzfxM(...song)), 50);
    });
  }


export const FormMusic = () => {
    const [sound, setSound] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault()

        const formData = new FormData(event.target)
        const feeling = formData.get('feeling')

        try {
            setLoading(true)
            const response = await fetch('/api/createSound', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feeling }),
            });
            setLoading(false)

            const result = await response.json()
            if(result.error) {
                setSound(null)
                alert(result.error)
                
            }

            console.log('Result:', parse(result));
            
            const songData = result

            const buffer = await render(parse(songData))
            console.log(buffer)
            
            const node = zzfxP(...buffer);


            // Reproduce la canción
            zzfxP(...buffer);


        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <>
            <section id="formMusic" className={styles.sectionFormMusic}>
                <h1>Choose your preferences and let’s create a new sound</h1>
                <div className={styles.lines}>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                </div>
                <div className={styles.music}>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="feeling">What kind of feeling would you like to express?</label>
                        <input type="text" id="feeling" name="feeling" required />
                        <button type="submit">Submit</button>
                    </form>
                    <article className={styles.musicPlayer}>
                        {loading && <div className={styles.loader}></div>}
                        {sound && <audio controls src={sound} />}
                    </article>
                </div>
            </section>
        </>
    );
}
