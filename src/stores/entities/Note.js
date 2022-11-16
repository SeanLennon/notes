import { Model } from "pinia-orm";
import { date } from "quasar";

export default class Note extends Model {
  // static entity() {
  //   return "notes";
  // }

  // static entity = "notes"; // eslint-disable-line

  static fields() {
    return {
      id: this.string(),
      title: this.string(null).notNullable(),
      description: this.string(null).notNullable(),
      favorite: this.boolean(false),
      subjectId: this.attr(null).notNullable(),
      created: this.string(date.formatDate(Date.now(), "YYYY/MM/DD HH:mm")),
      updated: this.string(date.formatDate(Date.now(), "YYYY/MM/DD HH:mm")),
    };
  }
}
