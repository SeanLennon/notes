import { Model } from "pinia-orm";
import { date } from "quasar";
import Note from "./Note";

export default class Subject extends Model {
  // static entity() {
  //   return "subjects";
  // }

  // static entity = "subjects"; // eslint-disable-line

  static fields() {
    return {
      id: this.string(),
      title: this.string(null).notNullable(),
      description: this.string(null).notNullable(),
      favorite: this.boolean(false),
      notebookId: this.attr(null).notNullable(),
      notes: this.hasMany(Note, "subjectId"),
      created: this.string(date.formatDate(Date.now(), "YYYY/MM/DD HH:mm")),
      updated: this.string(date.formatDate(Date.now(), "YYYY/MM/DD HH:mm")),
    };
  }
}
