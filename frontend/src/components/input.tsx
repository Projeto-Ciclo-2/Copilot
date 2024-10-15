interface InputProps{
    type: string;
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = (({ type, value, onChange, placeholder}) => {
    return(
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}/>
    )
})

export default Input;
