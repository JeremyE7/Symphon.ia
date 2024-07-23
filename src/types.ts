export interface SoundPrompt{
    feeling: string, 
    genre: string, 
    instrument: string 
}

export interface Sound{
    chords: [
        {
            chord: string,
            duration: string
        }
    ]
}