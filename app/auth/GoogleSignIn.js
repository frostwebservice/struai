import Head from "next/head";

const GoogleSignIn = () => (
    <Head>
        <script
            src="https://apis.google.com/js/platform.js"
            async
            defer
        ></script>
    </Head>
);

export default GoogleSignIn;
