'use strict';

var chunkSWSJNNXO_cjs = require('./chunk-SWSJNNXO.cjs');
var chunkSUWCCDLE_cjs = require('./chunk-SUWCCDLE.cjs');
var chunkQVQCHA2A_cjs = require('./chunk-QVQCHA2A.cjs');
var chunkOJDVHIBJ_cjs = require('./chunk-OJDVHIBJ.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');
var zod = require('zod');

var _instructions, _agents, _model, _routingAgent, _agentHistory, _AgentNetwork_instances, addToAgentHistory_fn, clearNetworkHistoryBeforeRun_fn;
var _AgentNetwork = class _AgentNetwork extends chunkSUWCCDLE_cjs.MastraBase {
  constructor(config) {
    super({ component: chunkQVQCHA2A_cjs.RegisteredLogger.NETWORK, name: "AgentNetwork" });
    chunk7D636BPD_cjs.__privateAdd(this, _AgentNetwork_instances);
    chunk7D636BPD_cjs.__privateAdd(this, _instructions);
    chunk7D636BPD_cjs.__privateAdd(this, _agents);
    chunk7D636BPD_cjs.__privateAdd(this, _model);
    chunk7D636BPD_cjs.__privateAdd(this, _routingAgent);
    chunk7D636BPD_cjs.__privateAdd(this, _agentHistory, {});
    chunk7D636BPD_cjs.__privateSet(this, _instructions, config.instructions);
    chunk7D636BPD_cjs.__privateSet(this, _agents, config.agents);
    chunk7D636BPD_cjs.__privateSet(this, _model, config.model);
    chunk7D636BPD_cjs.__privateSet(this, _routingAgent, new chunkSWSJNNXO_cjs.Agent({
      name: config.name,
      instructions: this.getInstructions(),
      model: chunk7D636BPD_cjs.__privateGet(this, _model),
      tools: this.getTools()
    }));
  }
  formatAgentId(name) {
    return name.replace(/[^a-zA-Z0-9_-]/g, "_");
  }
  getTools() {
    return {
      transmit: chunkOJDVHIBJ_cjs.createTool({
        id: "transmit",
        description: "Call one or more specialized agents to handle specific tasks",
        inputSchema: zod.z.object({
          actions: zod.z.array(
            zod.z.object({
              agent: zod.z.string().describe("The name of the agent to call"),
              input: zod.z.string().describe("The input to pass to the agent"),
              includeHistory: zod.z.boolean().optional().describe("Whether to include previous agent outputs in the context")
            })
          )
        }),
        execute: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async ({ context }) => {
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
              chunk7D636BPD_cjs.__privateMethod(this, _AgentNetwork_instances, addToAgentHistory_fn).call(this, action.agent, {
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
    return chunk7D636BPD_cjs.__privateGet(this, _agentHistory)[agentId] || [];
  }
  /**
   * Get the history of all agent interactions that have occurred in this network
   * @returns A record of agent interactions, keyed by agent ID
   */
  getAgentInteractionHistory() {
    return { ...chunk7D636BPD_cjs.__privateGet(this, _agentHistory) };
  }
  /**
   * Get a summary of agent interactions in a more readable format, displayed chronologically
   * @returns A formatted string with all agent interactions in chronological order
   */
  getAgentInteractionSummary() {
    const history = chunk7D636BPD_cjs.__privateGet(this, _agentHistory);
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
      const agent = chunk7D636BPD_cjs.__privateGet(this, _agents).find((agent2) => this.formatAgentId(agent2.name) === agentId);
      if (!agent) {
        throw new Error(
          `Agent "${agentId}" not found. Available agents: ${chunk7D636BPD_cjs.__privateGet(this, _agents).map((a) => this.formatAgentId(a.name)).join(", ")}`
        );
      }
      let messagesWithContext = [...input];
      if (includeHistory) {
        const allHistory = Object.entries(chunk7D636BPD_cjs.__privateGet(this, _agentHistory));
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
    const agentList = chunk7D636BPD_cjs.__privateGet(this, _agents).map((agent) => {
      const id = this.formatAgentId(agent.name);
      return ` - **${id}**: ${agent.name}`;
    }).join("\n");
    return `
            You are a router in a network of specialized AI agents. 
            Your job is to decide which agent should handle each step of a task.
            
            ## System Instructions
            ${chunk7D636BPD_cjs.__privateGet(this, _instructions)}
            
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
    return chunk7D636BPD_cjs.__privateGet(this, _routingAgent);
  }
  getAgents() {
    return chunk7D636BPD_cjs.__privateGet(this, _agents);
  }
  async generate(messages, args) {
    chunk7D636BPD_cjs.__privateMethod(this, _AgentNetwork_instances, clearNetworkHistoryBeforeRun_fn).call(this);
    this.logger.debug(`AgentNetwork: Starting generation with ${chunk7D636BPD_cjs.__privateGet(this, _agents).length} available agents`);
    const ops = {
      maxSteps: chunk7D636BPD_cjs.__privateGet(this, _agents)?.length * 10,
      // Default to 10 steps per agent
      ...args
    };
    this.logger.debug(`AgentNetwork: Routing with max steps: ${ops.maxSteps}`);
    const result = await chunk7D636BPD_cjs.__privateGet(this, _routingAgent).generate(
      messages,
      ops
    );
    this.logger.debug(`AgentNetwork: Generation complete with ${result.steps?.length || 0} steps`);
    return result;
  }
  async stream(messages, args) {
    chunk7D636BPD_cjs.__privateMethod(this, _AgentNetwork_instances, clearNetworkHistoryBeforeRun_fn).call(this);
    this.logger.debug(`AgentNetwork: Starting generation with ${chunk7D636BPD_cjs.__privateGet(this, _agents).length} available agents`);
    const ops = {
      maxSteps: chunk7D636BPD_cjs.__privateGet(this, _agents)?.length * 10,
      // Default to 10 steps per agent
      ...args
    };
    this.logger.debug(`AgentNetwork: Routing with max steps: ${ops.maxSteps}`);
    const result = await chunk7D636BPD_cjs.__privateGet(this, _routingAgent).stream(
      messages,
      ops
    );
    return result;
  }
  __registerMastra(p) {
    this.__setLogger(p.getLogger());
    chunk7D636BPD_cjs.__privateGet(this, _routingAgent).__registerMastra(p);
    for (const agent of chunk7D636BPD_cjs.__privateGet(this, _agents)) {
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
addToAgentHistory_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function(agentId, interaction) {
  if (!chunk7D636BPD_cjs.__privateGet(this, _agentHistory)[agentId]) {
    chunk7D636BPD_cjs.__privateGet(this, _agentHistory)[agentId] = [];
  }
  chunk7D636BPD_cjs.__privateGet(this, _agentHistory)[agentId].push({
    ...interaction,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}, "#addToAgentHistory");
clearNetworkHistoryBeforeRun_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function() {
  chunk7D636BPD_cjs.__privateSet(this, _agentHistory, {});
}, "#clearNetworkHistoryBeforeRun");
chunk7D636BPD_cjs.__name(_AgentNetwork, "AgentNetwork");
var AgentNetwork = _AgentNetwork;

exports.AgentNetwork = AgentNetwork;
//# sourceMappingURL=chunk-ILZVMOPS.cjs.map
//# sourceMappingURL=chunk-ILZVMOPS.cjs.map