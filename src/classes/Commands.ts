import axios from "axios";
import { Collection, Snowflake } from "discord.js";
import InteractiveClient from "..";
import { CommandController } from "../controllers/CommandController";
import { SlashCommand } from "../structures/SlashCommand";
import { discord } from "../util/constraints";
import registerCommand from "../util/registerCommand";
import { ApplicationCommand } from "../util/types/command";

export class Commands {
  private _client: InteractiveClient;
  
  public cache = new Collection<string, CommandController>();
  
  constructor(client: InteractiveClient) {
    this._client = client;
  }

  public async getAll(guild?: Snowflake): Promise<Collection<Snowflake, ApplicationCommand>> {
    const opts = { headers: { "Authorization": `Bot ${this._client.bot.token}` } };
    const application = await this._client.bot.fetchApplication()
    const url = (!guild ? `${discord.api_url}/applications/${application.id}/commands` : `${discord.api_url}/applications/${application.id}/guilds/${guild}/commands`);

    const newDat: ApplicationCommand[] = await axios.get(url, opts).then(dat => dat.data);
    const collection = new Collection<Snowflake, ApplicationCommand>();

    newDat.map(cmd => collection.set(cmd.id, cmd));

    return collection;
  }

  public async delete(id: Snowflake, guild?: Snowflake): Promise<void> {
    const opts = { headers: { "Authorization": `Bot ${this._client.bot.token}` } };
    const application = await this._client.bot.fetchApplication()
    const url = (!guild ? `${discord.api_url}/applications/${application.id}/commands/${id}` : `${discord.api_url}/applications/${application.id}/guilds/${guild}/commands/${id}`);

    await axios.delete(url, opts);

    return;
  }

  public async register(command: SlashCommand): Promise<CommandController> {
    let cachedCmd = this.cache.get(command.name);
    if (cachedCmd) return (await cachedCmd.update(command));

    const registeredData = await registerCommand(command, this._client);
    const controller = new CommandController(command, registeredData, this._client);

    this.cache.set(controller.command.name, controller);
    return controller;
  }
}