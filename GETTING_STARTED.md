# WorkflowAI - Getting Started Guide

## 🎯 What is WorkflowAI?

WorkflowAI is an AI-powered platform for creating and automating workflows. Using GROQ AI (Llama models), you can:
- Create workflows visually with a drag-and-drop builder
- Use AI to generate workflow steps automatically
- Upload and analyze PDF documents
- Chat with an AI assistant about workflows
- Deploy everything serverlessly to Vercel

## 🚀 Your First 5 Minutes

### 1. Start the App (1 min)
```bash
npm install
npm run dev
```
Open http://localhost:3000 in your browser

### 2. Add Your GROQ API Key (1 min)
- Edit `.env.local`:
  ```env
  NEXT_PUBLIC_GROQ_API_KEY=your_key_here
  ```
- Get your key from: https://console.groq.com/keys

### 3. Explore Templates (1 min)
- Click on **Templates** tab
- Browse the 4 professional workflow templates
- Read descriptions to understand each one

### 4. Create Your First Workflow (2 min)
- Click **Use Template** on any template
- The Workflow Builder opens
- Try editing the workflow name and description
- Click Save

## 📋 Common Tasks

### Create a Custom Workflow
1. Create a workflow from a template
2. Click **Edit** next to any workflow
3. Rename and add description
4. Edit individual steps:
   - Click **Edit** on a step
   - Change the name and description
   - Select step type (Input, Process, AI, Decision, Output)
   - For AI steps, add a prompt (tells AI what to do)
5. Add more steps with **+ Add Step**
6. Delete unnecessary steps
7. Reorder steps using ↑ ↓ arrows
8. Click **Save Workflow**

### Upload and Analyze a PDF
1. In Workflow Builder, click **Upload PDF**
2. Drag and drop your PDF or click to select
3. The system auto-processes:
   - Extracts text from PDF
   - Analyzes content
   - Suggests improvements
4. View the document in the sidebar

### Use AI Chat
1. Look for the chat icon (💬) on the right
2. Click to open the chat panel
3. Ask questions like:
   - "How do I create a workflow?"
   - "What are workflow steps?"
   - "Help me understand AI steps"
4. AI responds with helpful information

### Edit an Existing Workflow
1. Go to **My Workflows** tab
2. Click **Edit** on any workflow
3. Make your changes
4. Click **Save Workflow**

## 🎨 Understanding Workflow Steps

### Step Types

**Input**
- Receives data from the user
- Start point for workflows
- Example: Get customer information

**Process**
- Performs standard operations
- Transforms or manipulates data
- Example: Calculate credit score

**AI**
- Uses AI (Llama) to process data
- Requires an AI prompt
- Example: "Analyze this contract and identify risks"

**Decision**
- Makes branching choices
- Goes to different steps based on conditions
- Example: If credit approved, continue

**Output**
- Generates final results
- End point for workflows
- Example: Send approval email

## 💡 Pro Tips

1. **AI Prompts Matter**
   - Be specific in AI prompts
   - Example: "Extract the company name and founder info from this document"
   - Bad: "Process this text"

2. **Start Simple**
   - Create 3-5 steps first
   - Add complexity later
   - Test with sample data

3. **Use Templates**
   - Templates are pre-built optimized workflows
   - Customize them for your needs
   - Much faster than building from scratch

4. **Save Often**
   - Click Save after making changes
   - Workflows are stored locally in your browser
   - Consider backing up important workflows

5. **Test PDF Uploads**
   - Start with small PDFs
   - Make sure PDFs are not encrypted
   - System works best with clear text PDFs

## 🚨 Troubleshooting

### "API key not found" Error
- Make sure `.env.local` has your GROQ key
- Restart dev server: `npm run dev`
- Try refreshing the browser

### PDF Upload Fails
- Check file size (max 10MB)
- Ensure it's a valid PDF
- Try a different PDF file

### Chat Not Responding
- Check your GROQ API key
- Check internet connection
- Look for error messages in browser console

### Workflows Not Saving
- Check browser localStorage (might be full)
- Try a different browser
- Check browser console for errors

## 🔑 API Key Setup

### Get Your GROQ API Key

1. Go to https://console.groq.com/keys
2. Sign up for free (if not already)
3. Click **Create API Key**
4. Copy the key
5. Open `.env.local`
6. Add: `NEXT_PUBLIC_GROQ_API_KEY=your_copied_key`
7. Save and restart dev server

### API Key Limits
- Free tier: 30 calls/minute
- Perfect for POC and testing
- Upgrade for production use

## 📚 Next Steps

1. **Explore Workflows**
   - Try all 4 templates
   - Understand each step type
   - Create your own variations

2. **Learn AI Prompts**
   - Experiment with different prompts
   - See how AI responds
   - Refine prompts for better results

3. **Deploy to Production**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Get your app on Vercel (free tier)
   - Share with your team

4. **Customize**
   - Modify templates for your use case
   - Create domain-specific workflows
   - Add more AI steps

## 🎓 Learn More

- [Full Documentation](./README.md)
- [GROQ API Docs](https://console.groq.com/docs)
- [Next.js Tutorial](https://nextjs.org/learn)

## 💬 Questions?

Check the README.md for detailed documentation or refer to the inline code comments in the source files.

---

**Happy workflow building! 🚀**
