import { uid, date } from "quasar";
import Subject from "./Subject";

export default class Notebook {
  constructor({ data }) {
    this.id = data.id || uid();
    this.name = data.name?.trim() || "";
    this.favorite = data.favorite || false;
    this.subjects =
      data.subjects?.map(
        (sub) =>
          new Subject({
            data: sub,
          })
      ) || [];
    this.created =
      data.created || date.formatDate(Date.now(), "YYYY/MM/DD HH:mm");
    this.updated =
      data.updated || date.formatDate(Date.now(), "YYYY/MM/DD HH:mm");
  }

  getCreatedDateTimeFormated(format) {
    return date.formatDate(this.created, format);
  }
  getUpdatedDateTimeFormated(format) {
    return date.formatDate(this.updated, format);
  }

  getSubjectsCount() {
    return this.subjects.length || 0;
  }

  getType() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
