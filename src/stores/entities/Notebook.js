import { Model } from "pinia-orm";
import { date } from "quasar";
import Subject from "./Subject";

const entity = "notebooks";

export default class Notebook extends Model {
  // static entity() {
  //   return "notebooks";
  // }

  // static entity = entity;

  // static entity() {
  //   return entity;
  // }

  static fields() {
    return {
      id: this.string(),
      name: this.string(null).notNullable(),
      favorite: this.boolean(false),
      subjects: this.hasMany(Subject, "notebookId"),
      created: this.string(date.formatDate(Date.now(), "YYYY/MM/DD HH:mm")),
      updated: this.string(date.formatDate(Date.now(), "YYYY/MM/DD HH:mm")),
    };
  }
}
