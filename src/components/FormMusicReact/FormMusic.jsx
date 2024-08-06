import React, { useState } from 'react';
import styles from './FormMusic.module.css';
import { playSound } from '../../utils/generateSound';

export const FormMusic = () => {
    const [sound, setSound] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault()

        const formData = new FormData(event.target)
        const feeling = formData.get('feeling')
        const genre = formData.get('genre')
        const instrument = formData.get('instrument')

        try {
            const response = await fetch('/api/createSound', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feeling, genre, instrument }),
            });

            const result = await response.json()
            console.log(result)
            setSound(result)
            playSound(result)
        } catch (error) {
            console.error('Error:', error);
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
                        AQUI VA UN REPRODUCTOR DE MUSICA XD
                        {sound && <p>{sound.toString()}</p>}
                    </article>
                </div>
            </section>
        </>
    );
}
