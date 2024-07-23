import React, { useState } from 'react';
import styles from './FormMusic.module.css';
import { playSound } from '../../utils/generateSound';

export const FormMusic = () => {
    const [sound, setSound] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Previene la recarga de la página
        
        const formData = new FormData(event.target);
        const feeling = formData.get('feeling');
        const genre = formData.get('genre');
        const instrument = formData.get('instrument');
        
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
                <form onSubmit={handleSubmit}>
                    <label htmlFor="feeling">What kind of feeling would you like to express?</label>
                    <input type="text" id="feeling" name="feeling" />
                    <label htmlFor="genre">What genre would you like to apply for your music?</label>
                    <input type="text" id="genre" name="genre" />
                    <label htmlFor="instrument">What instrument would you like to use?</label>
                    <input type="text" id="instrument" name="instrument" />
                    <button type="submit">Submit</button>
                </form>
                <div>
                    {sound && <p>{sound.toString()}</p>}
                </div>
            </section>
        </>
    );
}
