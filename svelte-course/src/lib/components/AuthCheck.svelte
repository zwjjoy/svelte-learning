<script lang="ts">
    import { user } from "$lib/firebase";
</script>

{#if $user}
    <slot />
{:else}
    <p class="text-error text-center">
        You must be signed in to view this page.
        <a href="/login" class="btn btn-primary">Sign in</a>
    </p>        
{/if}