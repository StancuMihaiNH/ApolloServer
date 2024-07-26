import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export default class KeyVaultManager {
    constructor() {
        this.credential = new DefaultAzureCredential();
        this.keyVaultName = "nh-aicoe-kv";
        this.keyVaultUrl = `https://${this.keyVaultName}.vault.azure.net/`;
        this.client = new SecretClient(this.keyVaultUrl, this.credential);
    }

    async getSecret(secretName) {
        const secret = await this.client.getSecret(secretName);
        return secret.value;
    }

    static getInstance() {
        if (!KeyVaultManager.instance) {
            KeyVaultManager.instance = new KeyVaultManager();
        }
        return KeyVaultManager.instance;
    }
};