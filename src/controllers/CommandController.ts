import InteractiveClient from "..";
import { SlashCommand } from "../structures/SlashCommand";
import { ApplicationCommand } from "../util/types/command";
import updateCommand from "../util/updateCommand";

export class CommandController {
  private _command: SlashCommand;
  private _client: InteractiveClient;
  private _commandDat: ApplicationCommand;

  constructor(command: SlashCommand, raw: ApplicationCommand, client: InteractiveClient) {
    this._command = command;
    this._client = client;
    this._commandDat = raw;
  }

  get id(): string { return this._commandDat.id; }
  get name(): string { return this._commandDat.name; }
  get command(): SlashCommand { return this._command; }

  public async update(cmd: SlashCommand): Promise<this> {
    this._command = cmd;
    this._commandDat = await updateCommand(cmd, this._client);
    return this;
  }
}