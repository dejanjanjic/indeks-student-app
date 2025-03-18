export default class Announcements {
  constructor(
    id,
    title,
    header,
    content,
    signature,
    timeOfCreation,
    timeOfDeletion,
    year,
    announcementAttachment = []
  ) {
    this.id = id;
    this.title = title;
    this.header = header;
    this.content = content;
    this.signature = signature;
    this.timeOfCreation = new Date(timeOfCreation);
    this.timeOfDeletion = new Date(timeOfDeletion);
    this.year = year;
    this.announcementAttachment = announcementAttachment;
  }
}
