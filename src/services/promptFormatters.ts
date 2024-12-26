export const formatPrompt = (content: string, provider: string = 'openai') => {
  switch (provider) {
    case 'anthropic':
      return `Human: ${content}\n\nAssistant:`;
    case 'openai':
      return content;
    case 'custom':
      return content;
    default:
      return content;
  }
};