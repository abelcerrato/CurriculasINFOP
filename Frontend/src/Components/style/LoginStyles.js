import { makeStyles } from "@mui/styles";

const useLoginStyles = makeStyles(() => ({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
    },
    gridContainer: {
        minHeight: "50vh",
        boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "12px",
        overflow: "hidden",
    },
    formSection: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E53935",
        padding: "32px",
    },
    card: {
        padding: "24px",
        width: "80%",
        backgroundColor: "transparent",
        color: "#E53935",
        boxShadow: "none",
    },
    title: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "24px",
    },
    textField: {
        backgroundColor: "white",
        borderRadius: "10px",
    },
    forgotPassword: {
        marginTop: "8px",
        marginBottom: "24px",
        color: "white",
        textAlign: "right",
        cursor: "pointer",
    },
    button: {
        backgroundColor: "white",
        color: "#E53935",
        fontWeight: "bold",
        borderRadius: "30px",
        padding: "12px 0",
    },
    imageSection: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        padding: "32px",
    },
    image: {
        width: "90%",
        maxWidth: "400px",
        marginTop: "50px",
    },
}));

export default useLoginStyles;
