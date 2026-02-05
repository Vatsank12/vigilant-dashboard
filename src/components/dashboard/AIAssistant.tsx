import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Minimize2,
  Maximize2,
  Shield,
  Zap,
  Scan,
  Activity,
  Bot,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { icon: Scan, label: 'Scan System', prompt: 'Run a full system security scan' },
  { icon: Activity, label: 'Analyze Traffic', prompt: 'Analyze current network traffic patterns' },
  { icon: Shield, label: 'Check Threats', prompt: 'Check for active security threats' },
  { icon: Zap, label: 'Optimize', prompt: 'Suggest performance optimizations' },
];

const aiResponses: Record<string, string> = {
  'scan system': `🔍 **System Scan Initiated**

Scanning all system components for vulnerabilities...

**Results:**
- ✅ Kernel modules: Clean
- ✅ System binaries: Verified
- ✅ Network ports: 23 open (3 flagged for review)
- ⚠️ Outdated packages: 7 found
- ✅ Firewall rules: Active

**Recommendation:** Update the 7 outdated packages to patch known CVEs. Run \`sudo apt update && sudo apt upgrade\` to apply updates.`,

  'analyze traffic': `📊 **Network Traffic Analysis**

Analyzing packets from the last 60 seconds...

**Summary:**
- Total packets: 12,847
- Inbound: 7,234 (56%)
- Outbound: 5,613 (44%)

**Top Connections:**
\`\`\`
192.168.1.1    → api.github.com      (443/HTTPS)
192.168.1.1    → cdn.jsdelivr.net    (443/HTTPS)
192.168.1.1    → fonts.googleapis.com (443/HTTPS)
\`\`\`

**Anomalies:** None detected. All traffic patterns appear normal.`,

  'check threats': `🛡️ **Threat Assessment Report**

**Active Threats:** 0
**Potential Risks:** 2

**Details:**
1. **Medium Risk** - SSH login attempts from unknown IP (blocked)
   - Source: 45.33.32.156
   - Attempts: 47 in last hour
   - Status: Auto-blocked by fail2ban

2. **Low Risk** - Suspicious DNS query pattern
   - Query: tracking.analytics-*.com
   - Action: Monitored, not blocked

**Overall Status:** System is secure. Continue monitoring.`,

  'optimize': `⚡ **Performance Optimization Suggestions**

Based on current system metrics:

1. **Memory** (Currently 62% used)
   - Chrome is using 8.2% memory
   - Consider closing unused tabs
   
2. **CPU** (Currently 45% load)
   - \`node\` process running at 5.3%
   - All processes within normal range

3. **Disk I/O** (78% capacity)
   - ⚠️ Consider cleaning temp files
   - Run: \`sudo apt clean && sudo journalctl --vacuum-time=7d\`

4. **Network**
   - Latency: 12ms avg
   - No bottlenecks detected`,

  default: `I understand you're asking about security. Here are some things I can help with:

- **System Scans** - Check for vulnerabilities
- **Traffic Analysis** - Monitor network patterns  
- **Threat Detection** - Identify security risks
- **Optimization** - Improve system performance

Try one of the quick action buttons above, or ask me a specific question about your system's security.`,
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('scan')) return aiResponses['scan system'];
  if (lower.includes('traffic') || lower.includes('network')) return aiResponses['analyze traffic'];
  if (lower.includes('threat') || lower.includes('security')) return aiResponses['check threats'];
  if (lower.includes('optimize') || lower.includes('performance')) return aiResponses['optimize'];
  return aiResponses['default'];
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm your AI Security Assistant. I can help you scan systems, analyze network traffic, and detect potential threats. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getAIResponse(message),
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleQuickAction = (prompt: string) => {
    handleSend(prompt);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg neon-glow animate-pulse-glow z-50"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        'fixed z-50 glass-card border border-primary/20 rounded-xl shadow-2xl flex flex-col transition-all duration-300',
        isExpanded
          ? 'bottom-4 right-4 left-4 top-20 md:left-auto md:w-[600px] md:h-[600px]'
          : 'bottom-6 right-6 w-96 h-[500px]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot className="h-5 w-5 text-primary" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Security Assistant</h3>
            <span className="text-[10px] text-muted-foreground">Online • Ready to help</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-border/50">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1 bg-secondary/30 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
              onClick={() => handleQuickAction(action.prompt)}
            >
              <action.icon className="h-3 w-3" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 animate-fade-in',
                message.role === 'user' && 'flex-row-reverse'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                  message.role === 'assistant'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-secondary text-muted-foreground'
                )}
              >
                {message.role === 'assistant' ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div
                className={cn(
                  'flex-1 rounded-lg p-3 text-sm',
                  message.role === 'assistant'
                    ? 'bg-secondary/50 rounded-tl-none'
                    : 'bg-primary/10 text-primary-foreground rounded-tr-none'
                )}
              >
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                  {message.content.split('```').map((part, i) =>
                    i % 2 === 1 ? (
                      <pre key={i} className="bg-background/50 rounded p-2 overflow-x-auto my-2">
                        <code className="text-xs">{part}</code>
                      </pre>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-secondary/50 rounded-lg rounded-tl-none p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about security, threats, or system status..."
            className="bg-secondary/50"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
