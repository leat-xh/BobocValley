import { useNavigate } from "react-router";

function FirstHouse() {
    const navigate = useNavigate();
    return (
        <>
        <h1>A doua casa!</h1>
        <button
            onClick={() => {
                navigate("/")
            }}
        >Leave!</button>
        </>
    ) 
}

export default FirstHouse;