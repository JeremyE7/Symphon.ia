import * as Tone from 'tone';

const chordNotesMap = {
    'C': ['C4', 'E4', 'G4'],
    'G': ['G4', 'B4', 'D5'],
    'Am': ['A4', 'C5', 'E5'],
    'F': ['F4', 'A4', 'C5'],
    'Em': ['E4', 'G4', 'B4'],
    'E': ['E4', 'G#4', 'B4'],
    'D': ['D4', 'F#4', 'A4'],
    'Dm': ['D4', 'F4', 'A4'],
    'A': ['A4', 'C#5', 'E5'],
    'B': ['B4', 'D#5', 'F#5'],
    'Bm': ['B4', 'D5', 'F#5'],
    'C#m': ['C#4', 'E4', 'G#4'],
    'D#m': ['D#4', 'F#4', 'A#4']
}


export const playSound = async (soundData) => {
    await Tone.start() // Asegúrate de que el contexto de audio está iniciado

    const synth = new Tone.PolySynth(Tone.Synth).toDestination()
    console.log(soundData)
    let time = Tone.now()
    
    soundData.forEach(({ chord, duration }) => {
        console.log(chord)
        console.log(duration)
        // Verifica que `chord` y `duration` no sean undefined
        if (!chord || !duration) {
            console.error('Invalid chord or duration:', { chord, duration });
            return
        }
        const notes = chordNotesMap[chord] ?? chord;
        console.log('Playing:', { notes, duration, time })
        // // Reproduce el acorde con la duración especificada
        synth.triggerAttackRelease(notes, duration, time)
        time += Tone.Time(duration).toSeconds()
    });
}