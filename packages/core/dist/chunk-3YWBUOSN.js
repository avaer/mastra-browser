import { Agent } from './chunk-JENCNGOR.js';
import { createTool } from './chunk-YNOU42YW.js';
import { MastraBase } from './chunk-LE72NI7K.js';
import { RegisteredLogger } from './chunk-HEAZ5SGJ.js';
import { __name, __privateAdd, __privateSet, __privateGet, __privateMethod } from './chunk-WH5OY6PO.js';
import { z } from 'zod';

var _instructions, _agents, _model, _routingAgent, _agentHistory, _AgentNetwork_instances, addToAgentHistory_fn, clearNetworkHistoryBeforeRun_fn;
var _AgentNetwork = class _AgentNetwork extends MastraBase {
  constructor(config) {
    super({ component: RegisteredLogger.NETWORK, name: "AgentNetwork" });
    __privateAdd(this, _AgentNetwork_instances);
    __privateAdd(this, _instructions);
    __privateAdd(this, _agents);
    __privateAdd(this, _model);
    __privateAdd(this, _routingAgent);
    __privateAdd(this, _agentHistory, {});
    __privateSet(this, _instructions, config.instructions);
    __privateSet(this, _agents, config.agents);
    __privateSet(this, _model, config.model);
    __privateSet(this, _routingAgent, new Agent({
      name: config.name,
      instructions: this.getInstructions(),
      model: __privateGet(this, _model),
      tools: this.getTools()
    }));
  }
  formatAgentId(name) {
    return name.replace(/[^a-zA-Z0-9_-]/g, "_");
  }
  getTools() {
    return {
      transmit: createTool({
        id: "transmit",
        description: "Call one or more specialized agents to handle specific tasks",
        inputSchema: z.object({
          actions: z.array(
            z.object({
              agent: z.string().describe("The name of the agent to call"),
              input: z.string().describe("The input to pass to the agent"),
              includeHistory: z.boolean().optional().describe("Whether to include previous agent outputs in the context")
            })
          )
        }),
        execute: /* @__PURE__ */ __name(async ({ context }) => {
          try {
            const actions = context.actions;
            this.logger.debug(`Executing ${actions.length} specialized agents`);
            const results = await Promise.all(
              actions.map(
                (action) => this.executeAgent(action.agent, [{ role: "user", content: action.input }], action.includeHistory)
              )
            );
            this.logger.debug("Results:", { results });
            actions.forEach((action, index) => {
              __privateMethod(this, _AgentNetwork_instances, addToAgentHistory_fn).call(this, action.agent, {
                input: action.input,
                output: results[index] || ""
                // Ensure output is always a string
              });
            });
            return actions.map((action, index) => `[${action.agent}]: ${results[index]}`).join("\n\n");
          } catch (err) {
            const error = err;
            this.logger.error("Error in transmit tool:", { error });
            return `Error executing agents: ${error.message}`;
          }
        }, "execute")
      })
    };
  }
  getAgentHistory(agentId) {
    return __privateGet(this, _agentHistory)[agentId] || [];
  }
  /**
   * Get the history of all agent interactions that have occurred in this network
   * @returns A record of agent interactions, keyed by agent ID
   */
  getAgentInteractionHistory() {
    return { ...__privateGet(this, _agentHistory) };
  }
  /**
   * Get a summary of agent interactions in a more readable format, displayed chronologically
   * @returns A formatted string with all agent interactions in chronological order
   */
  getAgentInteractionSummary() {
    const history = __privateGet(this, _agentHistory);
    const agentIds = Object.keys(history);
    if (agentIds.length === 0) {
      return "No agent interactions have occurred yet.";
    }
    const allInteractions = [];
    let globalSequence = 0;
    agentIds.forEach((agentId) => {
      const interactions = history[agentId] || [];
      interactions.forEach((interaction, index) => {
        allInteractions.push({
          agentId,
          interaction,
          index,
          // Assign a sequence number based on when it was added to the history
          sequence: globalSequence++
        });
      });
    });
    allInteractions.sort((a, b) => {
      if (a.interaction.timestamp && b.interaction.timestamp) {
        return new Date(a.interaction.timestamp).getTime() - new Date(b.interaction.timestamp).getTime();
      }
      return a.sequence - b.sequence;
    });
    if (allInteractions.length === 0) {
      return "No agent interactions have occurred yet.";
    }
    return "# Chronological Agent Interactions\n\n" + allInteractions.map(
      (item, i) => `## Step ${i + 1}: Agent ${item.agentId} at ${item.interaction.timestamp}
**Input:** ${item.interaction.input.substring(0, 100)}${item.interaction.input.length > 100 ? "..." : ""}

**Output:** ${item.interaction.output.substring(0, 100)}${item.interaction.output.length > 100 ? "..." : ""}`
    ).join("\n\n");
  }
  async executeAgent(agentId, input, includeHistory = false) {
    try {
      const agent = __privateGet(this, _agents).find((agent2) => this.formatAgentId(agent2.name) === agentId);
      if (!agent) {
        throw new Error(
          `Agent "${agentId}" not found. Available agents: ${__privateGet(this, _agents).map((a) => this.formatAgentId(a.name)).join(", ")}`
        );
      }
      let messagesWithContext = [...input];
      if (includeHistory) {
        const allHistory = Object.entries(__privateGet(this, _agentHistory));
        if (allHistory.length > 0) {
          const contextMessage = {
            role: "system",
            content: `Previous agent interactions:

${allHistory.map(([agentName, interactions]) => {
              return `## ${agentName}
${interactions.map(
                (interaction, i) => `Interaction ${i + 1} (${interaction.timestamp || "No timestamp"}):
- Input: ${interaction.input}
- Output: ${interaction.output}`
              ).join("\n\n")}`;
            }).join("\n\n")}`
          };
          messagesWithContext = [contextMessage, ...messagesWithContext];
        }
      }
      const result = await agent.generate(messagesWithContext);
      return result.text;
    } catch (err) {
      const error = err;
      this.logger.error(`Error executing agent "${agentId}":`, { error });
      return `Unable to execute agent "${agentId}": ${error.message}`;
    }
  }
  getInstructions() {
    const agentList = __privateGet(this, _agents).map((agent) => {
      const id = this.formatAgentId(agent.name);
      return ` - **${id}**: ${agent.name}`;
    }).join("\n");
    return `
            You are a router in a network of specialized AI agents. 
            Your job is to decide which agent should handle each step of a task.
            
            ## System Instructions
            ${__privateGet(this, _instructions)}
            
            ## Available Specialized Agents
            You can call these agents using the "transmit" tool:
            ${agentList}
            
            ## How to Use the "transmit" Tool
            
            The "transmit" tool allows you to call one or more specialized agents.
            
            ### Single Agent Call
            To call a single agent, use this format:
            \`\`\`json
            {
              "actions": [
                {
                  "agent": "agent_name",
                  "input": "detailed instructions for the agent"
                }
              ]
            }
            \`\`\`
            
            ### Multiple Parallel Agent Calls
            To call multiple agents in parallel, use this format:
            \`\`\`json
            {
              "actions": [
                {
                  "agent": "first_agent_name",
                  "input": "detailed instructions for the first agent"
                },
                {
                  "agent": "second_agent_name",
                  "input": "detailed instructions for the second agent"
                }
              ]
            }
            \`\`\`
            
            ## Context Sharing
            
            When calling an agent, you can choose to include the output from previous agents in the context.
            This allows the agent to take into account the results from previous steps.
            
            To include context, add the "includeHistory" field to the action and set it to true:
            \`\`\`json
            {
              "actions": [
                {
                  "agent": "agent_name",
                  "input": "detailed instructions for the agent",
                  "includeHistory": true
                }
              ]
            }
            \`\`\`
            
            ## Best Practices
            1. Break down complex tasks into smaller steps
            2. Choose the most appropriate agent for each step
            3. Provide clear, detailed instructions to each agent
            4. Synthesize the results from multiple agents when needed
            5. Provide a final summary or answer to the user
            
            ## Workflow
            1. Analyze the user's request
            2. Identify which specialized agent(s) can help
            3. Call the appropriate agent(s) using the transmit tool
            4. Review the agent's response
            5. Either call more agents or provide a final answer
        `;
  }
  getRoutingAgent() {
    return __privateGet(this, _routingAgent);
  }
  getAgents() {
    return __privateGet(this, _agents);
  }
  async generate(messages, args) {
    __privateMethod(this, _AgentNetwork_instances, clearNetworkHistoryBeforeRun_fn).call(this);
    this.logger.debug(`AgentNetwork: Starting generation with ${__privateGet(this, _agents).length} available agents`);
    const ops = {
      maxSteps: __privateGet(this, _agents)?.length * 10,
      // Default to 10 steps per agent
      ...args
    };
    this.logger.debug(`AgentNetwork: Routing with max steps: ${ops.maxSteps}`);
    const result = await __privateGet(this, _routingAgent).generate(
      messages,
      ops
    );
    this.logger.debug(`AgentNetwork: Generation complete with ${result.steps?.length || 0} steps`);
    return result;
  }
  async stream(messages, args) {
    __privateMethod(this, _AgentNetwork_instances, clearNetworkHistoryBeforeRun_fn).call(this);
    this.logger.debug(`AgentNetwork: Starting generation with ${__privateGet(this, _agents).length} available agents`);
    const ops = {
      maxSteps: __privateGet(this, _agents)?.length * 10,
      // Default to 10 steps per agent
      ...args
    };
    this.logger.debug(`AgentNetwork: Routing with max steps: ${ops.maxSteps}`);
    const result = await __privateGet(this, _routingAgent).stream(
      messages,
      ops
    );
    return result;
  }
  __registerMastra(p) {
    this.__setLogger(p.getLogger());
    __privateGet(this, _routingAgent).__registerMastra(p);
    for (const agent of __privateGet(this, _agents)) {
      if (typeof agent.__registerMastra === "function") {
        agent.__registerMastra(p);
      }
    }
  }
};
_instructions = new WeakMap();
_agents = new WeakMap();
_model = new WeakMap();
_routingAgent = new WeakMap();
_agentHistory = new WeakMap();
_AgentNetwork_instances = new WeakSet();
addToAgentHistory_fn = /* @__PURE__ */ __name(function(agentId, interaction) {
  if (!__privateGet(this, _agentHistory)[agentId]) {
    __privateGet(this, _agentHistory)[agentId] = [];
  }
  __privateGet(this, _agentHistory)[agentId].push({
    ...interaction,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}, "#addToAgentHistory");
clearNetworkHistoryBeforeRun_fn = /* @__PURE__ */ __name(function() {
  __privateSet(this, _agentHistory, {});
}, "#clearNetworkHistoryBeforeRun");
__name(_AgentNetwork, "AgentNetwork");
var AgentNetwork = _AgentNetwork;

export { AgentNetwork };
//# sourceMappingURL=chunk-3YWBUOSN.js.map
//# sourceMappingURL=chunk-3YWBUOSN.js.map