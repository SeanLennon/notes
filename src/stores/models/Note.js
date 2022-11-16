import { data } from "autoprefixer";
import { date, uid } from "quasar";

export default class Note {
  constructor({ data }) {
    this.id = data.id || uid();
    this.title = data.title?.trim() || "";
    this.description = data.description?.trim() || "";
    this.content = data.content || "";
    this.favorite = data.favorite || false;
    this.created =
      data.created || date.formatDate(Date.now(), "YYYY/MM/DD HH:mm");
    this.updated =
      data.updated || date.formatDate(Date.now(), "YYYY/MM/DD HH:mm");

    this.header = "note";
    this.icon = "mdi-file-document";
    this.subject = {
      id: data.subject.id || null,
    };
  }

  getCreatedDateTimeFormated(format) {
    return date.formatDate(this.created, format);
  }
  getUpdatedDateTimeFormated(format) {
    return date.formatDate(this.updated, format);
  }

  getType() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      subject: {
        id: this.subject.id,
      },
    };
  }
}
