<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import { db , user } from "$lib/firebase";
    import { doc, getDoc, writeBatch } from "firebase/firestore";

    let username = "";
    let loading = false;
    let isAvailable = false;

    let debounceTimer: NodeJS.Timeout;

    const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    $: isValid = username?.length > 2 && username.length < 16 && re.test(username);
    $: isTouched = username.length > 0;
    $: isTaken = isValid && !isAvailable && !loading;


    async function checkAvailability() {
        isAvailable = false;
        loading = true;
        clearTimeout(debounceTimer);


        debounceTimer = setTimeout(async () => {
        
            console.log("checking availability for", username);

            const ref = doc(db, "usernames", username);
            // const exists = (await getDoc(ref)).exists();
            const exists = await getDoc(ref).then((doc) => doc.exists());

            isAvailable = !exists;
            loading = false;
        }, 500);
    }

    async function confirmUsername() {
        console.log("confirming username", username);
        const batch = writeBatch(db);
        batch.set(doc(db, "usernames", username), { uid: $user?.uid });
        batch.set(doc(db, "users", $user!.uid), { 
            username,
            photoURL: $user?.photoURL ?? null,
            published: true,
            bio: 'I am tghe Walrus', 
            links: [
                {
                    title: 'Test Link',
                    url: 'https://google.com',
                    icon: 'custom'
                }
            ]
        });

        await batch.commit();
        username = '';
        isAvailable = false;
    }

</script>

<AuthCheck>
    <h2>Username</h2>
    <form class="w-2/5" on:submit|preventDefault={confirmUsername}>
        <input
            type="text"
            placeholder="Username"
            class="input w-full"
            bind:value={username}
            on:input={checkAvailability}
            class:input-error={(!isValid && isTouched)}
            class:input-warning={isTaken}
            class:input-success={isAvailable && isValid && !loading}
        />
        <p>Is Available? {isAvailable}</p>
        <button
            type="submit"
            class="btn btn-success"
            disabled={!isAvailable || loading}
        >
            Confirm Username @{username}
        </button>
    </form>
</AuthCheck>
